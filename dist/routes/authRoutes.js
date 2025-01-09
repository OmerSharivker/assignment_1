"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authControllers_1 = __importDefault(require("../controllers/authControllers"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auth'
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
router.post('/auth/login', authControllers_1.default.login);
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: User registration
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auth'
 *     responses:
 *       200:
 *         description: Successful registration
 *       400:
 *         description: Email or password not valid
 *       500:
 *         description: Internal server error
 */
router.post('/auth/register', authControllers_1.default.register);
/**
 * @swagger
 * /auth/googlelogin:
 *   post:
 *     summary: Google login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Email is required
 *       500:
 *         description: Internal server error
 */
router.post('/auth/googlelogin', authControllers_1.default.googlelogin);
/**
 * @swagger
 * /auth/refreshToken:
 *   get:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: refreshToken
 *         schema:
 *           type: string
 *         required: true
 *         description: Refresh token
 *     responses:
 *       200:
 *         description: New access token
 *       400:
 *         description: Refresh token is required
 *       500:
 *         description: Internal server error
 */
router.get('/auth/refreshToken', authControllers_1.default.refreshToken);
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful logout
 *       400:
 *         description: Refresh token is required
 *       500:
 *         description: Internal server error
 */
router.post('/auth/logout', authControllers_1.default.logout);
/**
 * @swagger
 * /auth/user:
 *   get:
 *     summary: Get user info
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User info
 *       400:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/auth/user', authMiddleware_1.default, authControllers_1.default.getUserInfo);
/**
 * @swagger
 * /auth/user/update:
 *   post:
 *     summary: Update user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               image:
 *                 type: string
 *               userName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *       400:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/auth/user/update', authMiddleware_1.default, authControllers_1.default.profileUpdate);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map