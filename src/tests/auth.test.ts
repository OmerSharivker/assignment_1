import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';

let refreshToken = "";

beforeAll(async () => {
    try {
        // Register a new user
        const registerRes = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'testuser1@example.com',
                password: 'testpassword',
                userName: 'testuser'
            });
        expect(registerRes.statusCode).toEqual(200);

        // Login with the new user
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser1@example.com',
                password: 'testpassword'
            });
        expect(loginRes.statusCode).toEqual(200);

        global.token = loginRes.body.accessToken;
        refreshToken = loginRes.body.refreshToken;
        expect(global.token).toBeDefined();
    } catch (error) {
        console.error("Error during beforeAll setup:", error);
        throw error;
    }
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Auth Routes', () => {
    test('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'newuser@example.com',
                password: 'newpassword',
                userName: 'newuser'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('refreshTokens');
    });

    test('should login an existing user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser1@example.com',
                password: 'testpassword'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('accessToken');
    });

    test('should get a new access token from refreshtoken', async () => {
        const res = await request(app)
            .get('/api/auth/refreshToken')
            .query({ refreshToken });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    test('should logout a user with valid token', async () => {
        const res = await request(app)
            .post('/api/auth/logout')
            .send({ refreshToken });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Logout successful');
    });

    test('should not register a user with an existing email', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'testuser1@example.com', // Assuming this email is already registered
                password: 'testpassword',
                userName: 'testuser'
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    test('should not login with incorrect password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser1@example.com',
                password: 'wrongpassword'
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    test('should not get a new access token with invalid refresh token', async () => {
        const res = await request(app)
            .get('/api/auth/refreshToken')
            .query({ refreshToken: 'invalidToken' });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    test('should not logout a user with invalid token', async () => {
        const res = await request(app)
            .post('/api/auth/logout')
            .send({ refreshToken: 'invalidToken' });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    test('should  get posts without token', async () => {
        const res = await request(app)
            .get('/api/posts');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message');
    });
    /////////
    test('should get user info with valid token', async () => {
        const res = await request(app)
            .get('/api/auth/user')
            .set('Authorization', `Bearer ${global.token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('userName');
        expect(res.body).toHaveProperty('userId');
    });

    test('should update user profile', async () => {
        const res = await request(app)
            .post('/api/auth/user/update')
            .set('Authorization', `Bearer ${global.token}`)
            .send({
                image: 'newimage.jpg',
                userName: 'updateduser'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('image');
        expect(res.body).toHaveProperty('userName');
    });

    test('should not update user profile without token', async () => {
        const res = await request(app)
            .post('/api/auth/user/update')
            .send({
                image: 'newimage.jpg',
                userName: 'updateduser'
            });
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message');
    });

    test('should login with Google', async () => {
        const res = await request(app)
            .post('/api/auth/googlelogin')
            .send({
                email: 'googleuser@example.com',
                name: 'Google User'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('accessToken');
    });

    test('should not login with Google without email', async () => {
        const res = await request(app)
            .post('/api/auth/googlelogin')
            .send({
                name: 'Google User'
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });
});