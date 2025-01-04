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
const postModel_1 = __importDefault(require("../models/postModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
class commentsController {
    constructor() {
        this.postComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { content, postId, userId } = req.body;
            try {
                const user = yield userModel_1.default.findById(new mongoose_1.Types.ObjectId(userId));
                const userName = user.userName;
                const img = user.image;
                const newComment = yield commentsModel_1.default.create({
                    content,
                    postId: new mongoose_1.Types.ObjectId(postId),
                    ownerId: new mongoose_1.Types.ObjectId(userId),
                    userName,
                    img
                });
                if (newComment) {
                    yield postModel_1.default.findByIdAndUpdate(new mongoose_1.Types.ObjectId(postId), { $inc: { comments: 1 } }, { new: true });
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
                    (0, response_1.responseReturn)(res, 200, comment);
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
            const { content, userId } = req.body;
            try {
                const comment = yield commentsModel_1.default.findById(new mongoose_1.Types.ObjectId(commentId));
                if (comment.ownerId.toString() !== userId) {
                    (0, response_1.responseReturn)(res, 400, { message: "you are not the owner of this comment" });
                    return;
                }
                const updatedComment = yield commentsModel_1.default.findByIdAndUpdate(new mongoose_1.Types.ObjectId(commentId), { content: content }, { new: true });
                if (updatedComment) {
                    (0, response_1.responseReturn)(res, 200, { updatedComment, message: "success" });
                    return;
                }
                else {
                    (0, response_1.responseReturn)(res, 400, { message: "problem with new" });
                    return;
                }
            }
            catch (error) {
                (0, response_1.responseReturn)(res, 400, { message: "internal server error" });
            }
        });
        this.deleteComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { commentId } = req.params;
            const { userId } = req.body;
            try {
                const comment = yield commentsModel_1.default.findById(new mongoose_1.Types.ObjectId(commentId));
                if (comment.ownerId.toString() !== userId) {
                    (0, response_1.responseReturn)(res, 400, { message: "you are not the owner of this comment" });
                    return;
                }
                yield commentsModel_1.default.findByIdAndDelete(new mongoose_1.Types.ObjectId(commentId));
                yield postModel_1.default.findByIdAndUpdate(comment.postId, { $inc: { comments: -1 } });
                (0, response_1.responseReturn)(res, 200, { message: "comment deleted successfully" });
                return;
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
exports.default = new commentsController();
//# sourceMappingURL=commentsControllers.js.map