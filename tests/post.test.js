const request=require('supertest')
const app =require('../app')
const mongoose =require('mongoose')
const post = require('../models/postModel.js');

let id="";

beforeAll(async () =>{
   
})

afterAll(async () =>{
    await post.deleteMany();
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
        
    test("save post" , async ()=>{
        const newPostData = {
            message: 'This is a test post',
            sender: 12345
          };
        const res = await request(app).post('/api/posts').send(newPostData)
        id=res.body._id
        expect(res.statusCode).toEqual(201)
        expect(res.body.message).toEqual(newPostData.message)
        expect(res.body.sender).toEqual(newPostData.sender)
    });
  
    test("get post by id" , async ()=>{
        const res = await request(app).get(`/api/posts/${id}`)
        expect(res.statusCode).toEqual(200)
        expect(res.body.post._id).toEqual(id)
    });
  
    test("update post by id" , async ()=>{
        const updateMessage="new massage"
        const res = await request(app).put(`/api/posts/${id}`).send({ message: updateMessage })
        expect(res.statusCode).toEqual(201)
        expect(res.body.updatePost._id).toEqual(id)
        expect(res.body.updatePost.message).toEqual(updateMessage)
    });
});