import { Router, Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";
import { AuditService } from "./audit.service";
import { authenticate } from "../../middlewares/auth";
import { analystAndAbove, adminOnly } from "../../middlewares/rbac";

const AuditController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const page = Math.max(1, parseInt(String(req.query.page ?? "1"), 10));
    const limit = Math.min(100, parseInt(String(req.query.limit ?? "20"), 10));

    const { logs, total } = await AuditService.listAll({
      page,
      limit,
      action: req.query.action as string | undefined,
      entity: req.query.entity as string | undefined,
      performedById: req.query.userId as string | undefined,
    });

    ApiResponse.success(res, {
      data: logs,
      pagination: ApiResponse.buildPagination(page, limit, total),
    });
  }),

  getByEntity: asyncHandler(async (req: Request, res: Response) => {
    const entity = String(req.params.entity);
    const id = String(req.params.id);
    const logs = await AuditService.getByEntity(entity, id);
    ApiResponse.success(res, { data: logs });
  }),
};

const router = Router();
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Audit
 *   description: Immutable activity and change history
 */

/**
 * @swagger
 * /audit:
 *   get:
 *     summary: List all audit logs with optional filtering (Admin only)
 *     tags: [Audit]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: action
 *         schema: { type: string }
 *         description: "Filter by action: CREATE | UPDATE | DELETE | RESTORE | LOGIN | LOGOUT"
 *       - in: query
 *         name: entity
 *         schema: { type: string }
 *         description: "Filter by entity: User | Transaction"
 *       - in: query
 *         name: userId
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Paginated audit log entries
 */
router.get("/", adminOnly, AuditController.list);

/**
 * @swagger
 * /audit/{entity}/{id}:
 *   get:
 *     summary: Get full change history for a specific record (Analyst and above)
 *     tags: [Audit]
 *     parameters:
 *       - in: path
 *         name: entity
 *         required: true
 *         schema: { type: string }
 *         example: Transaction
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Ordered list of changes for this record
 */
router.get("/:entity/:id", analystAndAbove, AuditController.getByEntity);

export default router;
