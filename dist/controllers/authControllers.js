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
const response_1 = require("../utils/response");
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
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
                (0, response_1.responseReturn)(res, 400, { message: "login ok" });
            }
            catch (error) {
                (0, response_1.responseReturn)(res, 500, { error: "internal server error" });
            }
        });
    }
}
exports.default = new authControllers();
//# sourceMappingURL=authControllers.js.map