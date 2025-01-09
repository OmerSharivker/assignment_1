"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
let refreshToken = "";
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Register a new user
        const registerRes = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/register')
            .send({
            email: 'testuser1@example.com',
            password: 'testpassword',
            userName: 'testuser'
        });
        expect(registerRes.statusCode).toEqual(200);
        // Login with the new user
        const loginRes = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send({
            email: 'testuser1@example.com',
            password: 'testpassword'
        });
        expect(loginRes.statusCode).toEqual(200);
        global.token = loginRes.body.accessToken;
        refreshToken = loginRes.body.refreshToken;
        expect(global.token).toBeDefined();
    }
    catch (error) {
        console.error("Error during beforeAll setup:", error);
        throw error;
    }
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe('Auth Routes', () => {
    test('should register a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/register')
            .send({
            email: 'newuser@example.com',
            password: 'newpassword',
            userName: 'newuser'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('refreshTokens');
    }));
    test('should login an existing user', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send({
            email: 'testuser1@example.com',
            password: 'testpassword'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('accessToken');
    }));
    test('should get a new access token from refreshtoken', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get('/api/auth/refreshToken')
            .query({ refreshToken });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    }));
    test('should logout a user with valid token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/logout')
            .send({ refreshToken });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Logout successful');
    }));
    test('should not register a user with an existing email', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/register')
            .send({
            email: 'testuser1@example.com', // Assuming this email is already registered
            password: 'testpassword',
            userName: 'testuser'
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    }));
    test('should not login with incorrect password', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send({
            email: 'testuser1@example.com',
            password: 'wrongpassword'
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    }));
    test('should not get a new access token with invalid refresh token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get('/api/auth/refreshToken')
            .query({ refreshToken: 'invalidToken' });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    }));
    test('should not logout a user with invalid token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/logout')
            .send({ refreshToken: 'invalidToken' });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    }));
    test('should  get posts without token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get('/api/posts');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message');
    }));
    /////////
    test('should get user info with valid token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get('/api/auth/user')
            .set('Authorization', `Bearer ${global.token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('userName');
        expect(res.body).toHaveProperty('userId');
    }));
    test('should update user profile', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/user/update')
            .set('Authorization', `Bearer ${global.token}`)
            .send({
            image: 'newimage.jpg',
            userName: 'updateduser'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('image');
        expect(res.body).toHaveProperty('userName');
    }));
    test('should not update user profile without token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/user/update')
            .send({
            image: 'newimage.jpg',
            userName: 'updateduser'
        });
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message');
    }));
    test('should login with Google', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/googlelogin')
            .send({
            email: 'googleuser@example.com',
            name: 'Google User'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('accessToken');
    }));
    test('should not login with Google without email', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/googlelogin')
            .send({
            name: 'Google User'
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    }));
});
//# sourceMappingURL=auth.test.js.map