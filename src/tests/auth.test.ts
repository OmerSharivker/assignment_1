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
                email: 'sdashjsssbsddjhassasaabssdqqssdjhdasdasasdczxczxc@gmail.com',
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

    test('should not register a user with an existing email', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'ur@gmail.com', // Assuming this email is already registered
                password: '123456'
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    test('should not login with incorrect password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'ur@gmail.com',
                password: 'wrongpassword'
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    test('should not get a new access token with invalid refresh token', async () => {
        const res = await request(app)
            .get('/api/auth/refreshToken')
            .send({ refreshToken: 'invalidToken' });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    test('should not logout a user with invalid token', async () => {
        const res = await request(app)
            .get('/api/auth/logout')
            .send({ refreshToken: 'invalidToken' });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    /// tests for auth middleware

    test('should not get posts without token', async () => {
        const res = await request(app)
            .post('/api/posts');
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message');
    });
});