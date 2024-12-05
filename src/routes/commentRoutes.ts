
import express, { Request, Response } from 'express';
import  commentsControllers from '../controllers/commentsControllers';
import authMiddleware from '../middleware/authMiddleware';
const router = express.Router();

router.post('/comment', authMiddleware, commentsControllers.postComment);
router.get('/comment/:commentId',commentsControllers.readComment);
router.put('/comment/:commentId', authMiddleware, commentsControllers.updateComment);
router.delete('/comment/:commentId', authMiddleware, commentsControllers.deleteComment);
router.get('/comment/get-all-comments/:postId',  commentsControllers.getComments);

export default router;
