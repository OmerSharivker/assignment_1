"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postController_1 = __importDefault(require("../controllers/postController"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
router.get('/posts', postController_1.default.getAllPosts);
router.get('/posts/sender', authMiddleware_1.default, postController_1.default.getPostsBySender);
router.post('/posts', authMiddleware_1.default, postController_1.default.savePost);
router.get('/posts/:id', postController_1.default.getPostById);
router.put('/posts/:id', authMiddleware_1.default, postController_1.default.updateById);
exports.default = router;
//# sourceMappingURL=postRoutes.js.map