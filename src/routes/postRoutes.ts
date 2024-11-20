
import express, { Request, Response, Router } from 'express';
import postController from "../controllers/postController";

const router: Router = express.Router();

router.get('/posts', postController.getAllPosts);

router.get('/posts/sender',  postController.getPostsBySender);

router.post('/posts', postController.savePost);

router.get('/posts/:id', postController.getPostById);

router.put('/posts/:id',  postController.updateById);

export default router;