const request=require('supertest')
const app =require('../app')
const mongoose =require('mongoose')


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
})