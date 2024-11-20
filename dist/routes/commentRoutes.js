"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentsControllers_1 = __importDefault(require("../controllers/commentsControllers"));
const router = express_1.default.Router();
router.post('/comment', commentsControllers_1.default.postComment);
router.get('/comment/:commentId', commentsControllers_1.default.readComment);
router.put('/comment/:commentId', commentsControllers_1.default.updateComment);
router.delete('/comment/:commentId', commentsControllers_1.default.deleteComment);
router.get('/comment/get-all-comments/:postId', commentsControllers_1.default.getComments);
exports.default = router;
//# sourceMappingURL=commentRoutes.js.map