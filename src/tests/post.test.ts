import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';

let id = "";
let fakeId = "6751b12f555b26da3d29cf74";

beforeAll(async () => {
    try {
        // Register a new user
        const registerRes = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'testuser@example.com',
                password: 'testpassword',
                userName: 'testuser'
            });
        expect(registerRes.statusCode).toEqual(200);

        // Login with the new user
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'testpassword'
            });
        expect(loginRes.statusCode).toEqual(200);

        global.token = loginRes.body.accessToken;
        expect(global.token).toBeDefined();
    } catch (error) {
        console.error("Error during beforeAll setup:", error);
        throw error;
    }
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Posts tests", () => {
    test("get all posts", async () => {
        const res = await request(app).get('/api/posts');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("getPosts");
        expect(res.body).toHaveProperty("message", "posts fetched");
        expect(Array.isArray(res.body.getPosts)).toBe(true);
    });

    test("save post", async () => {
        const res = await request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${global.token}`)
            .send({
                content: "This is a test post",
                title: "Test Post",
                img: "test.jpg"
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("message", "new post created");
        id = res.body.newPost._id;
    });

    test("get post by id", async () => {
        const res = await request(app).get(`/api/posts/${id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("post");
        expect(res.body).toHaveProperty("message", "post found by id");
    });

    test("get post by sender", async () => {
        const res = await request(app)
            .get('/api/posts/sender')
            .set('Authorization', `Bearer ${global.token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("senderPosts");
        expect(Array.isArray(res.body.senderPosts)).toBe(true);
    });

    test("update post by id", async () => {
        const res = await request(app)
            .put(`/api/posts/${id}`)
            .set('Authorization', `Bearer ${global.token}`)
            .send({
                content: "This is an updated test post",
                title: "Updated Test Post",
                img: "updated.jpg"
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("message", "post updated by id");
        expect(res.body.updatePost.content).toEqual("This is an updated test post");
    });

    test("like post", async () => {
        const res = await request(app)
            .put(`/api/posts/like/${id}`)
            .set('Authorization', `Bearer ${global.token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("post");
        expect(res.body).toHaveProperty("message", "post liked");
    });

    test("unlike post", async () => {
        const res = await request(app)
            .put(`/api/posts/like/${id}`)
            .set('Authorization', `Bearer ${global.token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("post");
        expect(res.body).toHaveProperty("message", "post unliked");
    });

    test("delete post by id", async () => {
        const res = await request(app)
            .delete(`/api/posts/${id}`)
            .set('Authorization', `Bearer ${global.token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("message", "post deleted");
    });

    test("save post - failure", async () => {
        const res = await request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${global.token}`)
            .send({});
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty("message", "unknown error");
    });

    test("get post by id - failure (post not found)", async () => {
        const res = await request(app).get(`/api/posts/${fakeId}`);
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty("message", "post not found by id");
    });

    test("update post by id - failure (not the owner)", async () => {
        const res = await request(app)
            .put(`/api/posts/${fakeId}`)
            .set('Authorization', `Bearer ${global.token}`)
            .send({
                content: "Trying to update another user's post",
                title: "Fake Post",
                img: "fake.jpg"
            });
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty("message", "problem with updated by id");
    });

    test("like post - failure (post not found)", async () => {
        const res = await request(app)
            .put(`/api/posts/like/${fakeId}`)
            .set('Authorization', `Bearer ${global.token}`);
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty("message","problem with like post");
    });

    test("delete post by id - failure (post not found)", async () => {
        const res = await request(app)
            .delete(`/api/posts/${fakeId}`)
            .set('Authorization', `Bearer ${global.token}`);
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty("message", "problem with delete post");
    });

    test("get post by sender - failure (no token)", async () => {
        const res = await request(app).get('/api/posts/sender');
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty("message", "No token provided");
    });

    


    test("generate AI content - failure (missing title)", async () => {
        const res = await request(app)
            .post('/api/posts/ai')
            .send({});
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty("message");
    });
});