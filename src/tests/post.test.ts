import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import postModel from '../models/postModel'


let id = "";


    beforeAll(async () => {

        try {
            const loginRes = await request(app).post('/api/auth/login').send({
                email: 'ur@gmail.com',
                password: '123456'
            });
    
            if (loginRes.statusCode !== 200) {
                console.error("Login failed:", loginRes.body);
            }
    
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
            message: "This is a test post"
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("message", "This is a test post");
        id = res.body._id;
    });

    //get post by id
    test("get post by id", async () => {
        const res = await request(app).get(`/api/posts/${id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("post");
        expect(res.body).toHaveProperty("message", "post found by id");
    });

    //get post by sender
    test("get post by sender", async () => {
        const res = await request(app)
            .get('/api/posts/sender')
            .set('Authorization', `Bearer ${global.token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("senderPosts");
        expect(Array.isArray(res.body.senderPosts)).toBe(true);
    });

    //update post by id
    test("update post by id", async () => {
        const res = await request(app)
            .put(`/api/posts/${id}`)
            .set('Authorization', `Bearer ${global.token}`)
            .send({
                message: "This is an updated test post"
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("updatePost");
        expect(res.body).toHaveProperty("message", "post updated by id");
        expect(res.body.updatePost.message).toEqual("This is an updated test post");
    });

    


   
});