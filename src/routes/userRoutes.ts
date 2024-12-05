
import express, { Request, Response, Router } from 'express';
import postController from "../controllers/postController";
import authMiddleware from '../middleware/authMiddleware';
import { audit } from '../../node_modules/rxjs/dist/esm5/internal/operators/audit';

const router: Router = express.Router();

router.post('/users/create-post', authMiddleware ,postController.savePost);


export default router;