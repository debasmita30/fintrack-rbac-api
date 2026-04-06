import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";
import { DashboardService } from "./dashboard.service";

export const DashboardController = {
  summary: asyncHandler(async (req: Request, res: Response) => {
    const { user } = res.locals;
    const startDate = req.query.startDate
      ? new Date(req.query.startDate as string)
      : undefined;
    const endDate = req.query.endDate
      ? new Date(req.query.endDate as string)
      : undefined;

    const data = await DashboardService.getSummary({
      userId: user!.id,
      userRole: user!.role,
      startDate,
      endDate,
    });
    ApiResponse.success(res, { data });
  }),

  categoryBreakdown: asyncHandler(async (req: Request, res: Response) => {
    const { user } = res.locals;
    const startDate = req.query.startDate
      ? new Date(req.query.startDate as string)
      : undefined;
    const endDate = req.query.endDate
      ? new Date(req.query.endDate as string)
      : undefined;

    const data = await DashboardService.getCategoryBreakdown({
      userId: user!.id,
      userRole: user!.role,
      startDate,
      endDate,
    });
    ApiResponse.success(res, { data });
  }),

  monthlyTrends: asyncHandler(async (req: Request, res: Response) => {
    const { user } = res.locals;
    const months = req.query.months
      ? Math.min(24, parseInt(req.query.months as string, 10))
      : 6;

    const data = await DashboardService.getMonthlyTrends({
      userId: user!.id,
      userRole: user!.role,
      months,
    });
    ApiResponse.success(res, { data });
  }),

  recentActivity: asyncHandler(async (req: Request, res: Response) => {
    const { user } = res.locals;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 10;

    const data = await DashboardService.getRecentActivity({
      userId: user!.id,
      userRole: user!.role,
      limit,
    });
    ApiResponse.success(res, { data });
  }),

  anomalies: asyncHandler(async (req: Request, res: Response) => {
    const { user } = res.locals;
    const data = await DashboardService.getAnomalies({
      userId: user!.id,
      userRole: user!.role,
    });
    ApiResponse.success(res, {
      message: `Found ${data.length} anomalous transactions`,
      data,
    });
  }),

  weeklyFlow: asyncHandler(async (req: Request, res: Response) => {
    const { user } = res.locals;
    const data = await DashboardService.getWeeklyFlow({
      userId: user!.id,
      userRole: user!.role,
    });
    ApiResponse.success(res, { data });
  }),
};
