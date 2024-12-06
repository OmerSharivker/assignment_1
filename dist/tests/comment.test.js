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
        //create post here and save the id
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/posts')
            .set('Authorization', `Bearer ${global.token}`)
            .send({
            message: "This is a test post"
        });
        expect(res.statusCode).toEqual(201);
        postId = res.body._id;
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
    // create comment
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
    }));
    // get comment by id
    test("get comment by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get(`/api/comment/${commentId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("content", "This is a test comment");
    }));
    // update comment
    test("update comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .put(`/api/comment/${commentId}`)
            .set('Authorization', `Bearer ${global.token}`)
            .send({
            content: "This is an updated comment",
            postId: postId,
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.updatedComment).toHaveProperty("content", "This is an updated comment");
        expect(res.body).toHaveProperty("message", "success");
    }));
    // get comment by post id
    test("get comment by post id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get(`/api/comment/get-all-comments/${postId}`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body.allComments)).toBe(true);
        expect(res.body.allComments[0]).toHaveProperty("content", "This is an updated comment");
        expect(res.body.allComments[0]).toHaveProperty("postId", postId);
    }));
    // delete comment by id
    test("delete comment by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete(`/api/comment/${commentId}`)
            .set('Authorization', `Bearer ${global.token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("message", "comment deleted successfully");
    }));
});
//# sourceMappingURL=comment.test.js.map