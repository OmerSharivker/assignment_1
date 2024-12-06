import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import postModel from '../models/postModel'
import exp from 'constants';


let commentId = "";
let postId = "";


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
            //create post here and save the id

            const res = await request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${global.token}`)
            .send({
            message: "This is a test post"
            });
        expect(res.statusCode).toEqual(201);
           postId = res.body._id;
        } catch (error) {
            console.error("Error during beforeAll setup:", error);
            throw error;
        }
    });


afterAll(async () => {
    await mongoose.connection.close();
});

describe("Comments tests", () => {

// create comment

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
});

// get comment by id

test("get comment by id", async () => {
    const res = await request(app).get(`/api/comment/${commentId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("content", "This is a test comment");
});

// update comment
test("update comment", async () => {
    const res = await request(app)
        .put(`/api/comment/${commentId}`)
        .set('Authorization', `Bearer ${global.token}`)
        .send({
        content: "This is an updated comment",
        postId: postId,
        });
    expect(res.statusCode).toEqual(200);
expect(res.body.updatedComment).toHaveProperty("content", "This is an updated comment");
expect(res.body).toHaveProperty("message", "success");
});

// get comment by post id
test("get comment by post id", async () => {
    const res = await request(app).get(`/api/comment/get-all-comments/${postId}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.allComments)).toBe(true);
    expect(res.body.allComments[0]).toHaveProperty("content", "This is an updated comment");
    expect(res.body.allComments[0]).toHaveProperty("postId", postId);
});

// delete comment by id

test("delete comment by id", async () => {
    const res = await request(app)
        .delete(`/api/comment/${commentId}`)
        .set('Authorization', `Bearer ${global.token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "comment deleted successfully");  
}); 




   
});