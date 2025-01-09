import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import e from 'express';

let commentId = "";
let postId = "";
let ownerId = "";
beforeAll(async () => {
    try {
        // Register a new user
        const registerRes = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'testuser2@example.com',
                password: 'testpassword',
                userName: 'testuser'
            });
        expect(registerRes.statusCode).toEqual(200);

        // Login with the new user
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser2@example.com',
                password: 'testpassword'
            });
        expect(loginRes.statusCode).toEqual(200);

        global.token = loginRes.body.accessToken;
        expect(global.token).toBeDefined();

        // Create a post
        const postRes = await request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${global.token}`)
            .send({
                content: "This is a test post",
                title: "Test Post",
                img: "test.jpg"
            });
        expect(postRes.statusCode).toEqual(201);
        postId = postRes.body.newPost._id;
   
        
    } catch (error) {
        console.error("Error during beforeAll setup:", error);
        throw error;
    }
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Comments tests", () => {
    test("create comment", async () => {
        const res = await request(app)
            .post('/api/comment')
            .set('Authorization', `Bearer ${global.token}`)
            .send({
                content: "This is a test comment",
                postId: postId,
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("content", "This is a test comment");
        commentId = res.body._id;
        ownerId = res.body.ownerId;
    });

    test("get comment by id", async () => {
        const res = await request(app).get(`/api/comment/${commentId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("content", "This is a test comment");
    });

    test("update comment", async () => {
        const res = await request(app)
            .put(`/api/comment/${commentId}`)
            .set('Authorization', `Bearer ${global.token}`)
            .send({ 
                commentData: {
                    content: "This is an updated comment",
                    postId: postId,
                    img: "test.jpg",
                    userName: "testuser",
                    ownerId: ownerId
                }
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.updatedComment).toHaveProperty("content", "This is an updated comment");
        expect(res.body).toHaveProperty("message", "success");
    });

    test("get comments by post id", async () => {
 
        const res = await request(app).get(`/api/comment/get-all-comments/${postId}`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body.allComments)).toBe(true);
        expect(res.body.allComments[0]).toHaveProperty("content", "This is an updated comment");
        expect(res.body.allComments[0]).toHaveProperty("postId", postId);
    });

    test("delete comment by id", async () => {
        const res = await request(app)
            .delete(`/api/comment/${commentId}`)
            .set('Authorization', `Bearer ${global.token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("message", "comment deleted successfully");
    });
});