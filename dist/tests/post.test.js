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
let id = "";
let fakeId = "6751b12f555b26da3d29cf74";
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Register a new user
        const registerRes = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/register')
            .send({
            email: 'testuser@example.com',
            password: 'testpassword',
            userName: 'testuser'
        });
        expect(registerRes.statusCode).toEqual(200);
        // Login with the new user
        const loginRes = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send({
            email: 'testuser@example.com',
            password: 'testpassword'
        });
        expect(loginRes.statusCode).toEqual(200);
        global.token = loginRes.body.accessToken;
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
describe("Posts tests", () => {
    test("get all posts", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/posts');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("getPosts");
        expect(res.body).toHaveProperty("message", "posts fetched");
        expect(Array.isArray(res.body.getPosts)).toBe(true);
    }));
    test("save post", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/posts')
            .set('Authorization', `Bearer ${global.token}`)
            .send({
            content: "This is a test post",
            title: "Test Post",
            img: "test.jpg"
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("message", "new post created");
        id = res.body.newPost._id;
    }));
    test("get post by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get(`/api/posts/${id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("post");
        expect(res.body).toHaveProperty("message", "post found by id");
    }));
    test("get post by sender", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get('/api/posts/sender')
            .set('Authorization', `Bearer ${global.token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("senderPosts");
        expect(Array.isArray(res.body.senderPosts)).toBe(true);
    }));
    test("update post by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .put(`/api/posts/${id}`)
            .set('Authorization', `Bearer ${global.token}`)
            .send({
            content: "This is an updated test post",
            title: "Updated Test Post",
            img: "updated.jpg"
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("message", "post updated by id");
        expect(res.body.updatePost.content).toEqual("This is an updated test post");
    }));
    test("like post", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .put(`/api/posts/like/${id}`)
            .set('Authorization', `Bearer ${global.token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("post");
        expect(res.body).toHaveProperty("message", "post liked");
    }));
    test("unlike post", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .put(`/api/posts/like/${id}`)
            .set('Authorization', `Bearer ${global.token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("post");
        expect(res.body).toHaveProperty("message", "post unliked");
    }));
    test("delete post by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete(`/api/posts/${id}`)
            .set('Authorization', `Bearer ${global.token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("message", "post deleted");
    }));
    test("save post - failure", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/posts')
            .set('Authorization', `Bearer ${global.token}`)
            .send({});
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty("message", "unknown error");
    }));
    test("get post by id - failure (post not found)", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get(`/api/posts/${fakeId}`);
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty("message", "post not found by id");
    }));
    test("update post by id - failure (not the owner)", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .put(`/api/posts/${fakeId}`)
            .set('Authorization', `Bearer ${global.token}`)
            .send({
            content: "Trying to update another user's post",
            title: "Fake Post",
            img: "fake.jpg"
        });
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty("message", "problem with updated by id");
    }));
    test("like post - failure (post not found)", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .put(`/api/posts/like/${fakeId}`)
            .set('Authorization', `Bearer ${global.token}`);
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty("message", "problem with like post");
    }));
    test("delete post by id - failure (post not found)", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete(`/api/posts/${fakeId}`)
            .set('Authorization', `Bearer ${global.token}`);
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty("message", "problem with delete post");
    }));
    test("get post by sender - failure (no token)", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/posts/sender');
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty("message", "No token provided");
    }));
    test("generate AI content - failure (missing title)", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/posts/ai')
            .send({});
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty("message");
    }));
});
//# sourceMappingURL=post.test.js.map