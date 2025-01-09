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
let commentId = "";
let postId = "";
let ownerId = "";
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Register a new user
        const registerRes = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/register')
            .send({
            email: 'testuser2@example.com',
            password: 'testpassword',
            userName: 'testuser'
        });
        expect(registerRes.statusCode).toEqual(200);
        // Login with the new user
        const loginRes = yield (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send({
            email: 'testuser2@example.com',
            password: 'testpassword'
        });
        expect(loginRes.statusCode).toEqual(200);
        global.token = loginRes.body.accessToken;
        expect(global.token).toBeDefined();
        // Create a post
        const postRes = yield (0, supertest_1.default)(app_1.default)
            .post('/api/posts')
            .set('Authorization', `Bearer ${global.token}`)
            .send({
            content: "This is a test post",
            title: "Test Post",
            img: "test.jpg"
        });
        expect(postRes.statusCode).toEqual(201);
        postId = postRes.body.newPost._id;
    }
    catch (error) {
        console.error("Error during beforeAll setup:", error);
        throw error;
    }
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe("Comments tests", () => {
    test("create comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/comment')
            .set('Authorization', `Bearer ${global.token}`)
            .send({
            content: "This is a test comment",
            postId: postId,
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("content", "This is a test comment");
        commentId = res.body._id;
        ownerId = res.body.ownerId;
    }));
    test("get comment by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get(`/api/comment/${commentId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("content", "This is a test comment");
    }));
    test("update comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .put(`/api/comment/${commentId}`)
            .set('Authorization', `Bearer ${global.token}`)
            .send({
            commentData: {
                content: "This is an updated comment",
                postId: postId,
                img: "test.jpg",
                userName: "testuser",
                ownerId: ownerId
            }
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.updatedComment).toHaveProperty("content", "This is an updated comment");
        expect(res.body).toHaveProperty("message", "success");
    }));
    test("get comments by post id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get(`/api/comment/get-all-comments/${postId}`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body.allComments)).toBe(true);
        expect(res.body.allComments[0]).toHaveProperty("content", "This is an updated comment");
        expect(res.body.allComments[0]).toHaveProperty("postId", postId);
    }));
    test("delete comment by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete(`/api/comment/${commentId}`)
            .set('Authorization', `Bearer ${global.token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("message", "comment deleted successfully");
    }));
});
//# sourceMappingURL=comment.test.js.map