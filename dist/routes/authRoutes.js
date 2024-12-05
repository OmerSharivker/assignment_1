"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authControllers_1 = __importDefault(require("../controllers/authControllers"));
const router = express_1.default.Router();
router.post('/auth/login', authControllers_1.default.login);
router.post('/auth/register', authControllers_1.default.register);
router.get('/auth/refreshToken', authControllers_1.default.refreshToken);
router.get('/auth/logout', authControllers_1.default.logout);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map