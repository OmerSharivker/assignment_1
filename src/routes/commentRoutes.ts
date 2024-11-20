
import express, { Request, Response } from 'express';
import  commentsControllers from '../controllers/commentsControllers';
const router = express.Router();

router.post('/comment',  commentsControllers.postComment);
router.get('/comment/:commentId',commentsControllers.readComment);
router.put('/comment/:commentId',  commentsControllers.updateComment);
router.delete('/comment/:commentId',  commentsControllers.deleteComment);
router.get('/comment/get-all-comments/:postId',  commentsControllers.getComments);

export default router;
