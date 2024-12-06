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
                const newPost = yield postModel_1.default.create({ message: req.body.message, ownerId: userId });
                if (newPost) {
                    (0, response_1.responseReturn)(res, 201, newPost);
                }
                else {
                    (0, response_1.responseReturn)(res, 400, { message: "new post not working" });
                    console.log("new post");
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
            const { message, userId } = req.body;
            try {
                const post = yield postModel_1.default.findById(new mongoose_1.Types.ObjectId(id));
                if (userId !== post.ownerId.toString()) {
                    (0, response_1.responseReturn)(res, 400, { message: "you are not the owner of this post" });
                }
                const updatePost = yield postModel_1.default.findByIdAndUpdate(new mongoose_1.Types.ObjectId(id), { message: message }, { new: true });
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
    }
}
exports.default = new PostController();
//# sourceMappingURL=postController.js.map