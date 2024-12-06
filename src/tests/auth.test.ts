import request from 'supertest';
import app from '../app'; // Assuming your Express app is exported from app.ts
import mongoose from 'mongoose';

beforeAll(async () => {
  
})
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Auth Routes', () => {
    test('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'sdashjsssbddjhaaaabsdqqsdjhdasdasasdczxczxc@gmail.com',
                password: '121212'
            });
           
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('refreshTokens');
    });

    test('should login an existing user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'ur@gmail.com',
                password: '123456'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('accessToken');
    });

    test('should get a new access token from refreshtoken', async () => {
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'ur@gmail.com',
                password: '123456'
            });
        const refreshToken = loginRes.body.refreshToken;

        const res = await request(app)
            .get('/api/auth/refreshToken').send({refreshToken : refreshToken});
        expect(res.statusCode).toEqual(200);
    });

    test('should logout a user with valid token', async () => {
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
            email: 'ur@gmail.com',
            password: '123456'
            });
        const refreshToken = loginRes.body.refreshToken;

        const res = await request(app)
            .get('/api/auth/logout').send({refreshToken : refreshToken});
        expect(res.statusCode).toEqual(200);
    });


    test('login - should return error when email or password is missing', async () => {
        const res = await request(app)
          .post('/api/auth/login')
          .send({});  // Missing email and password
        
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'password and email are required');
      });
    
      // Error handling in register when email or password is missing
      test('register - should return error when email or password is missing', async () => {
        const res = await request(app)
          .post('/api/auth/register')
          .send({});  // Missing email and password
        
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'email or password not valid');
      });
    
 
});