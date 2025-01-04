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
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = require("../utils/token");
const postModel_1 = __importDefault(require("../models/postModel"));
class authControllers {
    constructor() {
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email || !password) {
                (0, response_1.responseReturn)(res, 400, { error: "password and email are required" });
            }
            try {
                const user = yield userModel_1.default.findOne({ email });
                if (!user) {
                    (0, response_1.responseReturn)(res, 400, { error: "password or email are not found" });
                    return;
                }
                const isValid = yield bcrypt_1.default.compare(password, user.password);
                if (!isValid) {
                    (0, response_1.responseReturn)(res, 400, { error: "password or email are not found" });
                    return;
                }
                const accessToken = yield (0, token_1.createToken)({ id: user._id }, "1h");
                const refreshToken = yield (0, token_1.createToken)({ id: user._id }, "7d");
                user.refreshTokens = user.refreshTokens ? [...user.refreshTokens, refreshToken] : [refreshToken];
                yield user.save();
                (0, response_1.responseReturn)(res, 200, { refreshToken, accessToken, message: "login ok", user });
            }
            catch (error) {
                (0, response_1.responseReturn)(res, 500, { error: "internal server error" });
            }
        });
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password, userName } = req.body;
            if (!email || !password) {
                (0, response_1.responseReturn)(res, 400, { error: "email or password not valid" });
                return;
            }
            try {
                const userExists = yield userModel_1.default.findOne({ email });
                if (userExists) {
                    (0, response_1.responseReturn)(res, 400, { error: "User already exists" });
                    return;
                }
                const salt = yield bcrypt_1.default.genSalt(10);
                const hashPassword = yield bcrypt_1.default.hash(password, salt);
                const user = yield userModel_1.default.create({
                    email,
                    password: hashPassword,
                    userName,
                });
                (0, response_1.responseReturn)(res, 200, user);
                return;
            }
            catch (error) {
                (0, response_1.responseReturn)(res, 401, error);
            }
        });
        //end
        this.refreshToken = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { refreshToken } = req.query;
            if (!refreshToken) {
                (0, response_1.responseReturn)(res, 400, { error: "Refresh token is required" });
                return;
            }
            try {
                const user = yield userModel_1.default.findOne({ refreshTokens: refreshToken });
                if (!user) {
                    (0, response_1.responseReturn)(res, 400, { error: "Invalid refresh token" });
                    return;
                }
                const newAccessToken = yield (0, token_1.createToken)({ id: user._id }, "1h");
                (0, response_1.responseReturn)(res, 200, { token: newAccessToken });
            }
            catch (error) {
                (0, response_1.responseReturn)(res, 500, { error: "Internal server error" });
            }
        });
        this.logout = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                (0, response_1.responseReturn)(res, 400, { error: "Refresh token is required" });
                return;
            }
            try {
                const user = yield userModel_1.default.findOne({ refreshTokens: refreshToken });
                if (!user) {
                    (0, response_1.responseReturn)(res, 400, { error: "Invalid refresh token" });
                    return;
                }
                user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
                yield user.save();
                (0, response_1.responseReturn)(res, 200, { message: "Logout successful" });
            }
            catch (error) {
                (0, response_1.responseReturn)(res, 500, { error: "Internal server error" });
            }
        });
        this.getUserInfo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.body;
            const user = yield userModel_1.default.findById(new mongoose_1.Types.ObjectId(userId));
            if (user) {
                const image = user.image ? user.image : null;
                const userName = user.userName ? user.userName : null;
                const userId = user._id.toString();
                (0, response_1.responseReturn)(res, 200, { image, userName, userId });
                return;
            }
            else {
                (0, response_1.responseReturn)(res, 400, { error: "user not found" });
            }
        });
        this.profileUpdate = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId, image, userName } = req.body;
            const user = yield userModel_1.default.findByIdAndUpdate(new mongoose_1.Types.ObjectId(userId), { image, userName }, { new: true });
            yield postModel_1.default.findOneAndUpdate({ 'ownerId': new mongoose_1.Types.ObjectId(userId) }, { userImg: image, userName }, { new: true });
            if (user) {
                (0, response_1.responseReturn)(res, 200, { image, userName });
                return;
            }
            else {
                (0, response_1.responseReturn)(res, 400, { error: "user not found" });
            }
        });
    }
}
exports.default = new authControllers();
//# sourceMappingURL=authControllers.js.map