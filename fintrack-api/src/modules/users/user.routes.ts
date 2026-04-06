import { Router } from "express";
import { UserController } from "./user.controller";
import { authenticate } from "../../middlewares/auth";
import { adminOnly } from "../../middlewares/rbac";
import { validate } from "../../middlewares/validate";
import {
  createUserSchema,
  updateUserSchema,
  listUsersQuerySchema,
} from "./user.schema";

const router = Router();

// All user management routes require authentication + ADMIN role
router.use(authenticate, adminOnly);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management (Admin only)
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: List all users with filtering and pagination
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: role
 *         schema: { type: string, enum: [VIEWER, ANALYST, ADMIN] }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [ACTIVE, INACTIVE] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search by name or email
 *     responses:
 *       200:
 *         description: Paginated list of users
 *       403:
 *         description: Admin role required
 */
router.get("/", validate("query", listUsersQuerySchema), UserController.list);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, name, password]
 *             properties:
 *               email: { type: string, format: email }
 *               name: { type: string }
 *               password: { type: string }
 *               role:
 *                 type: string
 *                 enum: [VIEWER, ANALYST, ADMIN]
 *                 default: VIEWER
 *     responses:
 *       201:
 *         description: User created
 *       409:
 *         description: Email already in use
 */
router.post("/", validate("body", createUserSchema), UserController.create);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a single user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get("/:id", UserController.getById);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update user name, role, or status
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               role: { type: string, enum: [VIEWER, ANALYST, ADMIN] }
 *               status: { type: string, enum: [ACTIVE, INACTIVE] }
 *     responses:
 *       200:
 *         description: User updated
 */
router.patch(
  "/:id",
  validate("body", updateUserSchema),
  UserController.update
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deactivate a user (soft delete)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User deactivated
 */
router.delete("/:id", UserController.delete);

export default router;
