 /**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - message
 *         - ownerId
 *       properties:
 *         message:
 *           type: string
 *           description: The message content of the post
 *         ownerId:
 *           type: string
 *           description: The ID of the owner (user) of the post
 */


/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Retrieve a list of posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: The created post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */

/**
 * @swagger
 * /posts/sender:
 *   get:
 *     summary: Retrieve posts by sender
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of posts by the sender
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Retrieve a single post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post ID
 *     responses:
 *       200:
 *         description: A single post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *   put:
 *     summary: Update a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: The updated post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
import express, { Request, Response, Router } from 'express';
import postController from "../controllers/postController";
import authMiddleware from '../middleware/authMiddleware';
import multerMiddleware from '../middleware/multerMiddleware';


const router: Router = express.Router();

router.get('/posts', postController.getAllPosts);

router.get('/posts/sender', authMiddleware ,postController.getPostsBySender);
 

router.post('/posts', authMiddleware, postController.savePost);


router.put('/posts/like/:id',authMiddleware, postController.likePost);


router.get('/posts/:id', postController.getPostById);


router.put('/posts/:id', authMiddleware, postController.updateById);


router.delete('/posts/:id', authMiddleware, postController.deletePost);

router.post('/posts/upload', authMiddleware ,  multerMiddleware , postController.savePhoto);



router.post('/posts/ai' , postController.getAiContent);

export default router;