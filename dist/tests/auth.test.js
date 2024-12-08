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
const app_1 = __importDefault(require("../app")); // Assuming your Express app is exported from app.ts
const mongoose_1 = __importDefault(require("mongoose"));
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe('Auth Routes', () => {
    test('should register a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/register')
            .send({
            email: 'sdashjsssbsddjhassasaabssdqqssdjhdasdasasdczxczxc@gmail.com',
            password: '121212'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('refreshTokens');
    }));
    test('should login an existing user', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send({
            email: 'ur@gmail.com',
            password: '123456'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('accessToken');
    }));
    test('should get a new access token from refreshtoken', () => __awaiter(void 0, void 0, void 0, function* () {
        const loginRes = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send({
            email: 'ur@gmail.com',
            password: '123456'
        });
        const refreshToken = loginRes.body.refreshToken;
        const res = yield (0, supertest_1.default)(app_1.default)
            .get('/api/auth/refreshToken').send({ refreshToken: refreshToken });
        expect(res.statusCode).toEqual(200);
    }));
    test('should logout a user with valid token', () => __awaiter(void 0, void 0, void 0, function* () {
        const loginRes = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send({
            email: 'ur@gmail.com',
            password: '123456'
        });
        const refreshToken = loginRes.body.refreshToken;
        const res = yield (0, supertest_1.default)(app_1.default)
            .get('/api/auth/logout').send({ refreshToken: refreshToken });
        expect(res.statusCode).toEqual(200);
    }));
    test('should not register a user with an existing email', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/register')
            .send({
            email: 'ur@gmail.com', // Assuming this email is already registered
            password: '123456'
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    }));
    test('should not login with incorrect password', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send({
            email: 'ur@gmail.com',
            password: 'wrongpassword'
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    }));
    test('should not get a new access token with invalid refresh token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get('/api/auth/refreshToken')
            .send({ refreshToken: 'invalidToken' });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    }));
    test('should not logout a user with invalid token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get('/api/auth/logout')
            .send({ refreshToken: 'invalidToken' });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    }));
    /// tests for auth middleware
    test('should not get posts without token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/posts');
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message');
    }));
});
//# sourceMappingURL=auth.test.js.map