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
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loginRes = yield (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({
            email: 'ur@gmail.com',
            password: '123456'
        });
        if (loginRes.statusCode !== 200) {
            console.error("Login failed:", loginRes.body);
        }
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
            message: "This is a test post"
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("message", "This is a test post");
        id = res.body._id;
    }));
    //get post by id
    test("get post by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get(`/api/posts/${id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("post");
        expect(res.body).toHaveProperty("message", "post found by id");
    }));
    //get post by sender
    test("get post by sender", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get('/api/posts/sender')
            .set('Authorization', `Bearer ${global.token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("senderPosts");
        expect(Array.isArray(res.body.senderPosts)).toBe(true);
    }));
    //update post by id
    test("update post by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .put(`/api/posts/${id}`)
            .set('Authorization', `Bearer ${global.token}`)
            .send({
            message: "This is an updated test post"
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("updatePost");
        expect(res.body).toHaveProperty("message", "post updated by id");
        expect(res.body.updatePost.message).toEqual("This is an updated test post");
    }));
});
//# sourceMappingURL=post.test.js.map