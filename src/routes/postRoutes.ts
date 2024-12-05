
import express, { Request, Response, Router } from 'express';
import postController from "../controllers/postController";
import authMiddleware from '../middleware/authMiddleware';

const router: Router = express.Router();

router.get('/posts', postController.getAllPosts);

router.get('/posts/sender', authMiddleware ,postController.getPostsBySender);

router.post('/posts', postController.savePost);

router.get('/posts/:id', postController.getPostById);

router.put('/posts/:id',  postController.updateById);

export default router;