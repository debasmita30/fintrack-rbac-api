import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { authenticate } from "../../middlewares/auth";
import { dashboardLimiter } from "../../middlewares/rateLimiter";

const router = Router();
router.use(authenticate, dashboardLimiter);

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Aggregated analytics and summary data (all authenticated roles)
 */

/**
 * @swagger
 * /dashboard/summary:
 *   get:
 *     summary: High-level financial summary (income, expenses, net balance, savings rate)
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *         description: Filter from this date
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *         description: Filter to this date
 *     responses:
 *       200:
 *         description: Summary object with totals and averages
 */
router.get("/summary", DashboardController.summary);

/**
 * @swagger
 * /dashboard/categories:
 *   get:
 *     summary: Category-wise income and expense breakdown with percentage shares
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Array of categories with totals and share percentages
 */
router.get("/categories", DashboardController.categoryBreakdown);

/**
 * @swagger
 * /dashboard/trends/monthly:
 *   get:
 *     summary: Month-by-month income vs expense trend
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: months
 *         schema: { type: integer, default: 6, maximum: 24 }
 *         description: Number of past months to include
 *     responses:
 *       200:
 *         description: Array of monthly buckets with income, expenses, and net
 */
router.get("/trends/monthly", DashboardController.monthlyTrends);

/**
 * @swagger
 * /dashboard/trends/weekly:
 *   get:
 *     summary: Week-by-week cash flow for the current month
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: 4-week breakdown of income vs expenses this month
 */
router.get("/trends/weekly", DashboardController.weeklyFlow);

/**
 * @swagger
 * /dashboard/recent:
 *   get:
 *     summary: Latest N transactions (recent activity feed)
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10, maximum: 50 }
 *     responses:
 *       200:
 *         description: Latest transactions
 */
router.get("/recent", DashboardController.recentActivity);

/**
 * @swagger
 * /dashboard/anomalies:
 *   get:
 *     summary: Detect anomalous transactions using statistical z-score analysis
 *     tags: [Dashboard]
 *     description: |
 *       Flags transactions that deviate more than 2 standard deviations from
 *       the mean for their category and type. Useful for spotting unusual spending.
 *     responses:
 *       200:
 *         description: List of flagged transactions with z-score and deviation direction
 */
router.get("/anomalies", DashboardController.anomalies);

export default router;
