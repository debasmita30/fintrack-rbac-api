import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { authenticate } from "../../middlewares/auth";
import { analystAndAbove, adminOnly } from "../../middlewares/rbac";
import { validate } from "../../middlewares/validate";
import {
  createTransactionSchema,
  updateTransactionSchema,
  listTransactionsQuerySchema,
} from "./transaction.schema";

const router = Router();
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Financial records management
 */

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: List transactions with advanced filtering
 *     tags: [Transactions]
 *     description: |
 *       - **VIEWER / ANALYST**: Returns only their own transactions
 *       - **ADMIN**: Returns all transactions
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [INCOME, EXPENSE] }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Partial match
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: minAmount
 *         schema: { type: number }
 *       - in: query
 *         name: maxAmount
 *         schema: { type: number }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search in description, notes, and category
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [date, amount, createdAt, category], default: date }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc], default: desc }
 *       - in: query
 *         name: includeDeleted
 *         schema: { type: boolean, default: false }
 *         description: Include soft-deleted records (Admin only in practice)
 *     responses:
 *       200:
 *         description: Paginated list of transactions
 */
router.get(
  "/",
  validate("query", listTransactionsQuerySchema),
  TransactionController.list
);

/**
 * @swagger
 * /transactions/export/csv:
 *   get:
 *     summary: Export transactions as CSV file
 *     tags: [Transactions]
 *     description: |
 *       Downloads a CSV file of all accessible transactions.
 *       - Admins get all transactions
 *       - Others get their own
 *     responses:
 *       200:
 *         description: CSV file download
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 */
router.get("/export/csv", TransactionController.exportCsv);

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Get a single transaction by ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Transaction details
 *       403:
 *         description: Access denied
 *       404:
 *         description: Not found
 */
router.get("/:id", TransactionController.getById);

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new financial transaction
 *     tags: [Transactions]
 *     description: Requires ANALYST or ADMIN role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, type, category, date]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 5000
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               category:
 *                 type: string
 *                 example: Salary
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-15"
 *               description:
 *                 type: string
 *               notes:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items: { type: string }
 *     responses:
 *       201:
 *         description: Transaction created
 *       403:
 *         description: Insufficient role
 */
router.post(
  "/",
  analystAndAbove,
  validate("body", createTransactionSchema),
  TransactionController.create
);

/**
 * @swagger
 * /transactions/{id}:
 *   patch:
 *     summary: Update a transaction
 *     tags: [Transactions]
 *     description: Requires ANALYST or ADMIN role. Non-admins can only edit their own.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Transaction updated
 */
router.patch(
  "/:id",
  analystAndAbove,
  validate("body", updateTransactionSchema),
  TransactionController.update
);

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Soft-delete a transaction (restorable)
 *     tags: [Transactions]
 *     description: Requires ANALYST or ADMIN role. Record is archived, not permanently removed.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Transaction soft-deleted
 */
router.delete("/:id", analystAndAbove, TransactionController.delete);

/**
 * @swagger
 * /transactions/{id}/restore:
 *   post:
 *     summary: Restore a soft-deleted transaction (Admin only)
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Transaction restored
 */
router.post("/:id/restore", adminOnly, TransactionController.restore);

export default router;
