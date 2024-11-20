"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    "message": String,
    "sender": Number
});
exports.default = (0, mongoose_1.model)('posts', postSchema);
//# sourceMappingURL=postModel.js.map