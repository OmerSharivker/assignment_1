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
const postModel_1 = __importDefault(require("../models/postModel"));
const response_1 = require("../utils/response");
const mongoose_1 = require("mongoose");
const commentsModel_1 = __importDefault(require("../models/commentsModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
class PostController {
    constructor() {
        this.getAllPosts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const getPosts = yield postModel_1.default.find();
                if (getPosts) {
                    (0, response_1.responseReturn)(res, 200, { getPosts, message: "posts fetched" });
                }
                else {
                    (0, response_1.responseReturn)(res, 400, { message: "Problem in fetching posts" });
                }
            }
            catch (error) {
                (0, response_1.responseReturn)(res, 500, { message: "unknown error" });
            }
        });
        this.savePost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.body;
            try {
                const user = yield userModel_1.default.findById(new mongoose_1.Types.ObjectId(userId));
                const userName = user.userName;
                const userImg = user.image;
                const postImg = req.body.img;
                const newPost = yield postModel_1.default.create({
                    content: req.body.content,
                    title: req.body.title,
                    ownerId: userId,
                    userName,
                    userImg,
                    postImg
                });
                if (newPost) {
                    (0, response_1.responseReturn)(res, 201, { message: "new post created" });
                }
                else {
                    (0, response_1.responseReturn)(res, 400, { message: "new post not working" });
                }
            }
            catch (error) {
                (0, response_1.responseReturn)(res, 500, { message: "unknown error" });
            }
        });
        this.getPostsBySender = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const senderPosts = yield postModel_1.default.find({ 'ownerId': req.body.userId });
                if (senderPosts) {
                    (0, response_1.responseReturn)(res, 200, { senderPosts });
                }
                else {
                    (0, response_1.responseReturn)(res, 400, { message: "couldn't fetch the specific user posts" });
                }
            }
            catch (error) {
                (0, response_1.responseReturn)(res, 500, { message: "unknown error" });
            }
        });
        this.getPostById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const post = yield postModel_1.default.findById(new mongoose_1.Types.ObjectId(id));
                if (post) {
                    (0, response_1.responseReturn)(res, 200, { post, message: "post found by id" });
                }
                else {
                    (0, response_1.responseReturn)(res, 400, { message: "post not found by id" });
                }
            }
            catch (error) {
                (0, response_1.responseReturn)(res, 500, { message: "problem with find by id" });
            }
        });
        this.updateById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { content, title, userId } = req.body;
            try {
                const post = yield postModel_1.default.findById(new mongoose_1.Types.ObjectId(id));
                if (userId !== post.ownerId.toString()) {
                    (0, response_1.responseReturn)(res, 400, { message: "you are not the owner of this post" });
                }
                const updatePost = yield postModel_1.default.findByIdAndUpdate(new mongoose_1.Types.ObjectId(id), { content, title }, { new: true });
                if (updatePost) {
                    (0, response_1.responseReturn)(res, 201, { updatePost, message: "post updated by id" });
                }
                else {
                    (0, response_1.responseReturn)(res, 400, { message: "post not updated by id" });
                }
            }
            catch (error) {
                (0, response_1.responseReturn)(res, 500, { message: "problem with updated by id" });
            }
        });
        this.likePost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { userId } = req.body;
            try {
                const post = yield postModel_1.default.findById(new mongoose_1.Types.ObjectId(id));
                if (post.likes.includes(userId)) {
                    post.likes = post.likes.filter((like) => like.toString() !== userId);
                    post.numLikes = post.likes.length;
                    yield post.save();
                    (0, response_1.responseReturn)(res, 200, { post, message: "post unliked" });
                    return;
                }
                post.likes.push(userId);
                post.numLikes = post.likes.length;
                yield post.save();
                if (post.likes) {
                    (0, response_1.responseReturn)(res, 200, { post, message: "post liked" });
                }
                else {
                    (0, response_1.responseReturn)(res, 400, { message: "post not liked" });
                }
            }
            catch (error) {
                (0, response_1.responseReturn)(res, 500, { message: "problem with like post" });
            }
        });
        this.deletePost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { userId } = req.body;
            try {
                const post = yield postModel_1.default.findById(new mongoose_1.Types.ObjectId(id));
                if (post.ownerId.toString() !== userId) {
                    (0, response_1.responseReturn)(res, 400, { message: "you are not the owner of this post" });
                }
                const deletePost = yield postModel_1.default.findByIdAndDelete(new mongoose_1.Types.ObjectId(id));
                if (deletePost) {
                    yield commentsModel_1.default.deleteMany({ postId: new mongoose_1.Types.ObjectId(id) });
                    (0, response_1.responseReturn)(res, 200, { message: "post deleted" });
                }
                else {
                    (0, response_1.responseReturn)(res, 400, { message: "post not deleted" });
                }
            }
            catch (error) {
                (0, response_1.responseReturn)(res, 500, { message: "problem with delete post" });
            }
        });
        this.savePhoto = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.file) {
                    (0, response_1.responseReturn)(res, 400, { message: "file not found" });
                    return;
                }
                const fileUrl = `/uploads/${req.file.originalname}`; // Fixed template string syntax
                (0, response_1.responseReturn)(res, 200, { url: fileUrl });
            }
            catch (error) {
                (0, response_1.responseReturn)(res, 500, { message: "Error uploading file" });
            }
        });
    }
}
exports.default = new PostController();
//# sourceMappingURL=postController.js.map