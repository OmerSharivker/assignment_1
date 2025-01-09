"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postController_1 = __importDefault(require("../controllers/postController"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const multerMiddleware_1 = __importDefault(require("../middleware/multerMiddleware"));
const router = express_1.default.Router();
/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get('/posts', postController_1.default.getAllPosts);
/**
 * @swagger
 * /posts/sender:
 *   get:
 *     summary: Get posts by sender
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get('/posts/sender', authMiddleware_1.default, postController_1.default.getPostsBySender);
/**
 * @swagger
 * /posts:
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
 *         description: Post created successfully
 *       400:
 *         description: Problem with creating post
 *       500:
 *         description: Internal server error
 */
router.post('/posts', authMiddleware_1.default, postController_1.default.savePost);
/**
 * @swagger
 * /posts/like/{id}:
 *   put:
 *     summary: Like a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post liked/unliked successfully
 *       400:
 *         description: Problem with liking/unliking post
 *       500:
 *         description: Internal server error
 */
router.put('/posts/like/:id', authMiddleware_1.default, postController_1.default.likePost);
/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
router.get('/posts/:id', postController_1.default.getPostById);
/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: Post updated successfully
 *       400:
 *         description: Problem with updating post
 *       500:
 *         description: Internal server error
 */
router.put('/posts/:id', authMiddleware_1.default, postController_1.default.updateById);
/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       400:
 *         description: Problem with deleting post
 *       500:
 *         description: Internal server error
 */
router.delete('/posts/:id', authMiddleware_1.default, postController_1.default.deletePost);
/**
 * @swagger
 * /posts/upload:
 *   post:
 *     summary: Upload a photo
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Photo uploaded successfully
 *       400:
 *         description: Problem with uploading photo
 *       500:
 *         description: Internal server error
 */
router.post('/posts/upload', authMiddleware_1.default, multerMiddleware_1.default, postController_1.default.savePhoto);
/**
 * @swagger
 * /posts/ai:
 *   post:
 *     summary: Generate AI content
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: AI content generated successfully
 *       500:
 *         description: Problem with generating AI content
 */
router.post('/posts/ai', postController_1.default.getAiContent);
exports.default = router;
//# sourceMappingURL=postRoutes.js.map