import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validate } from "../../middlewares/validate";
import { authenticate } from "../../middlewares/auth";
import { authLimiter } from "../../middlewares/rateLimiter";
import {
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
} from "./auth.schema";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and session management
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@fintrack.io
 *               password:
 *                 type: string
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: Login successful — returns access + refresh tokens
 *       401:
 *         description: Invalid credentials
 *       422:
 *         description: Validation error
 */
router.post(
  "/login",
  authLimiter,
  validate("body", loginSchema),
  AuthController.login
);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Rotate tokens using a valid refresh token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access and refresh tokens
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post(
  "/refresh",
  validate("body", refreshTokenSchema),
  AuthController.refresh
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Revoke current session
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post("/logout", authenticate, AuthController.logout);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current authenticated user's profile
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Current user data
 */
router.get("/me", authenticate, AuthController.getMe);

/**
 * @swagger
 * /auth/change-password:
 *   put:
 *     summary: Change password (requires current password)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword, confirmPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 description: Min 8 chars, must include uppercase, number, special char
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Current password incorrect
 */
router.put(
  "/change-password",
  authenticate,
  validate("body", changePasswordSchema),
  AuthController.changePassword
);

export default router;
