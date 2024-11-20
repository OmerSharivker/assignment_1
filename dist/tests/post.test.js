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
const postModel_1 = __importDefault(require("../models/postModel"));
let id = "";
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // Add any setup code here if needed
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
    test("get posts by sender", () => __awaiter(void 0, void 0, void 0, function* () {
        const senderId = 123;
        const samplePosts = [
            { message: "Post 1", sender: senderId },
            { message: "Post 2", sender: senderId }
        ];
        yield postModel_1.default.insertMany(samplePosts);
        const res = yield (0, supertest_1.default)(app_1.default).get(`/api/posts/sender?sender=${senderId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("senderPosts");
        expect(Array.isArray(res.body.senderPosts)).toBe(true);
        expect(res.body.senderPosts.length).toBeGreaterThan(0);
    }));
    test("save post", () => __awaiter(void 0, void 0, void 0, function* () {
        const newPostData = {
            message: 'This is a test post',
            sender: 12345
        };
        const res = yield (0, supertest_1.default)(app_1.default).post('/api/posts').send(newPostData);
        id = res.body._id;
        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual(newPostData.message);
        expect(res.body.sender).toEqual(newPostData.sender);
    }));
    test("get post by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get(`/api/posts/${id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.post._id).toEqual(id);
    }));
    test("update post by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const updateMessage = "new message";
        const res = yield (0, supertest_1.default)(app_1.default).put(`/api/posts/${id}`).send({ message: updateMessage });
        expect(res.statusCode).toEqual(201);
        expect(res.body.updatePost._id).toEqual(id);
        expect(res.body.updatePost.message).toEqual(updateMessage);
    }));
});
//# sourceMappingURL=post.test.js.map