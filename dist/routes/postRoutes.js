"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postController_1 = __importDefault(require("../controllers/postController"));
const router = express_1.default.Router();
router.get('/posts', postController_1.default.getAllPosts);
router.get('/posts/sender', postController_1.default.getPostsBySender);
router.post('/posts', postController_1.default.savePost);
router.get('/posts/:id', postController_1.default.getPostById);
router.put('/posts/:id', postController_1.default.updateById);
exports.default = router;
//# sourceMappingURL=postRoutes.js.map