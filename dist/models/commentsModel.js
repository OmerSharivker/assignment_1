"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true
    },
    postId: {
        type: mongoose_1.Schema.ObjectId,
        required: true
    }
});
exports.default = (0, mongoose_1.model)('comment', commentSchema);
//# sourceMappingURL=commentsModel.js.map