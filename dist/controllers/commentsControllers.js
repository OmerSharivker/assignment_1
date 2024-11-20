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
const mongoose_1 = require("mongoose");
const response_1 = require("../utils/response");
const commentsModel_1 = __importDefault(require("../models/commentsModel"));
class PostController {
    constructor() {
        this.postComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { content, postId } = req.body;
            try {
                const newComment = yield commentsModel_1.default.create({
                    content,
                    postId: new mongoose_1.Types.ObjectId(postId)
                });
                if (newComment) {
                    (0, response_1.responseReturn)(res, 201, newComment);
                }
                else {
                    (0, response_1.responseReturn)(res, 400, { message: "problem with new comment" });
                }
            }
            catch (error) {
                (0, response_1.responseReturn)(res, 400, { message: "internal server error" });
            }
        });
        this.readComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { commentId } = req.params;
            try {
                const comment = yield commentsModel_1.default.findById(new mongoose_1.Types.ObjectId(commentId));
                if (comment) {
                    (0, response_1.responseReturn)(res, 200, comment.content);
                }
                else {
                    (0, response_1.responseReturn)(res, 400, { message: "problem with new comment" });
                }
            }
            catch (error) {
                (0, response_1.responseReturn)(res, 400, { message: "internal server error" });
            }
        });
        this.updateComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { commentId } = req.params;
            const { content } = req.body;
            try {
                const updatedComment = yield commentsModel_1.default.findByIdAndUpdate(new mongoose_1.Types.ObjectId(commentId), { content: content }, { new: true });
                if (updatedComment) {
                    (0, response_1.responseReturn)(res, 200, { updatedComment, message: "success" });
                }
                else {
                    (0, response_1.responseReturn)(res, 400, { message: "problem with new" });
                }
            }
            catch (error) {
                (0, response_1.responseReturn)(res, 400, { message: "internal server error" });
            }
        });
        this.deleteComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { commentId } = req.params;
            try {
                yield commentsModel_1.default.findByIdAndDelete(new mongoose_1.Types.ObjectId(commentId));
                (0, response_1.responseReturn)(res, 200, { message: "comment deleted successfully" });
            }
            catch (error) {
                (0, response_1.responseReturn)(res, 400, { message: "internal server error" });
            }
        });
        this.getComments = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { postId } = req.params;
            try {
                const allComments = yield commentsModel_1.default.find({ postId });
                if (allComments) {
                    (0, response_1.responseReturn)(res, 200, { allComments });
                }
                else {
                    (0, response_1.responseReturn)(res, 400, { message: "problem with all comments" });
                }
            }
            catch (error) {
                (0, response_1.responseReturn)(res, 400, { message: "internal server error" });
            }
        });
    }
}
exports.default = new PostController();
//# sourceMappingURL=commentsControllers.js.map