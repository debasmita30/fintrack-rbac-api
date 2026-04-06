import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";
import { TransactionService } from "./transaction.service";

export const TransactionController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const tx = await TransactionService.create(req.body, res.locals.user!.id);
    ApiResponse.created(res, {
      message: "Transaction created successfully",
      data: tx,
    });
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const { user } = res.locals;
    const { transactions, total, page, limit } = await TransactionService.list(
      req.query as any,
      user!.id,
      user!.role
    );
    ApiResponse.success(res, {
      data: transactions,
      pagination: ApiResponse.buildPagination(page, limit, total),
    });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const { user } = res.locals;
    const tx = await TransactionService.getById(
      String(req.params.id),
      user!.id,
      user!.role
    );
    ApiResponse.success(res, { data: tx });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { user } = res.locals;
    const tx = await TransactionService.update(
      String(req.params.id),
      req.body,
      user!.id,
      user!.role
    );
    ApiResponse.success(res, {
      message: "Transaction updated successfully",
      data: tx,
    });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const { user } = res.locals;
    await TransactionService.softDelete(String(req.params.id), user!.id, user!.role);
    ApiResponse.success(res, {
      message: "Transaction deleted successfully (soft delete — restorable)",
    });
  }),

  restore: asyncHandler(async (req: Request, res: Response) => {
    const tx = await TransactionService.restore(
      String(req.params.id),
      res.locals.user!.id
    );
    ApiResponse.success(res, {
      message: "Transaction restored successfully",
      data: tx,
    });
  }),

  exportCsv: asyncHandler(async (req: Request, res: Response) => {
    const { user } = res.locals;
    const rows = await TransactionService.exportCsv(user!.id, user!.role);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="transactions_${new Date().toISOString().split("T")[0]}.csv"`
    );

    if (rows.length === 0) {
      res.end("No data");
      return;
    }

    const headers = Object.keys(rows[0]).join(",");
    const body = rows
      .map((row: Record<string, unknown>) =>
        Object.values(row)
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    res.end(`${headers}\n${body}`);
  }),
};
