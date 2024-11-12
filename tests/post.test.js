const request=require('supertest')
const app =require('../app')
const mongoose =require('mongoose')
const post = require('../models/postModel.js');


beforeAll(async () =>{
   
})

afterEach(async () => {
    await post.deleteMany();
})

afterAll(async () =>{
    await mongoose.connection.close();
})    

describe("Posts tests",()=>{
    test("get all post" , async ()=>{
        const res = await request(app).get('/api/posts');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("getPosts");
        expect(res.body).toHaveProperty("message", "posts fetched");
        expect(Array.isArray(res.body.getPosts)).toBe(true);
    });

    test("get posts by sender" , async ()=>{
        const senderId = 123;
        const samplePosts = [
            { message: "Post 1", sender: senderId },
            { message: "Post 2", sender: senderId }
        ];
        await post.insertMany(samplePosts);
    
        const res = await request(app).get(`/api/posts/sender?sender=${senderId}`);
    
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("senderPosts");
        expect(Array.isArray(res.body.senderPosts)).toBe(true);
        expect(res.body.senderPosts.length).toBeGreaterThan(0);
    });
})