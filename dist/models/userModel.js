"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    refreshTokens: {
        type: [String], default: []
    },
    image: {
        type: String,
        default: '/api/image.png'
    },
    userName: {
        type: String,
        required: true,
    }
});
exports.default = (0, mongoose_1.model)('user', UserSchema);
//# sourceMappingURL=userModel.js.map