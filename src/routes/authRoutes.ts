
import express, { Request, Response, Router } from 'express';
import authControllers from '../controllers/authControllers';

const router: Router = express.Router();

router.post('/auth/login', authControllers.login);
router.post('/auth/register', authControllers.register);



export default router;