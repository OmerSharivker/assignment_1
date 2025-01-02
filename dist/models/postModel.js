"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    likes: {
        type: [mongoose_1.Schema.ObjectId],
    },
    numLikes: {
        type: Number,
        default: 0
    },
    comments: {
        type: Number,
        default: 0
    },
    ownerId: {
        type: mongoose_1.Schema.ObjectId,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
});
exports.default = (0, mongoose_1.model)('posts', postSchema);
//# sourceMappingURL=postModel.js.map