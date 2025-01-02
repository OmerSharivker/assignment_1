"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const express_1 = __importDefault(require("express"));
const postController_1 = __importDefault(require("../controllers/postController"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const multerMiddleware_1 = __importDefault(require("../middleware/multerMiddleware"));
const router = express_1.default.Router();
router.get('/posts', postController_1.default.getAllPosts);
router.get('/posts/sender', authMiddleware_1.default, postController_1.default.getPostsBySender);
router.post('/posts', authMiddleware_1.default, postController_1.default.savePost);
router.put('/posts/like/:id', authMiddleware_1.default, postController_1.default.likePost);
router.get('/posts/:id', postController_1.default.getPostById);
router.put('/posts/:id', authMiddleware_1.default, postController_1.default.updateById);
router.delete('/posts/:id', authMiddleware_1.default, postController_1.default.deletePost);
router.post('/posts/upload', authMiddleware_1.default, multerMiddleware_1.default, postController_1.default.savePhoto);
exports.default = router;
//# sourceMappingURL=postRoutes.js.map