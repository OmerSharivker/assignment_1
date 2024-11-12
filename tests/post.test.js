const request=require('supertest')
const app =require('../app')
const mongoose =require('mongoose')
let id="";

beforeAll(async () =>{
   
})

afterAll(async () =>{
    await mongoose.connection.close();
})    

describe("Posts tests",()=>{
    test("get all post" , async ()=>{
        const res = await request(app).get('/api/posts');
        expect(res.statusCode).toEqual(200)
    })
    test("save post" , async ()=>{
        const newPostData = {
            message: 'This is a test post',
            sender: '12345'
          };
        const res = await request(app).post('/api/posts').send(newPostData)
        id=res.body._id
        expect(res.statusCode).toEqual(201)
        expect(res.body.message).toEqual(newPostData.message)
        expect(res.body.sender).toEqual(newPostData.sender)
    })
    test("get post by id" , async ()=>{
        const res = await request(app).get(`/api/posts/${id}`)
        expect(res.statusCode).toEqual(200)
        expect(res.body.post._id).toEqual(id)
    })

})