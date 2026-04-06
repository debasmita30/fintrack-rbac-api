import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";
import { AuthService } from "./auth.service";

export const AuthController = {
  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body, {
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    ApiResponse.success(res, {
      message: "Login successful",
      data: result,
    });
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.refreshTokens(req.body.refreshToken);

    ApiResponse.success(res, {
      message: "Tokens refreshed successfully",
      data: result,
    });
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const userId = res.locals.user!.id;
    const refreshToken = req.body?.refreshToken;

    await AuthService.logout(refreshToken, userId);

    ApiResponse.success(res, { message: "Logged out successfully" });
  }),

  changePassword: asyncHandler(async (req: Request, res: Response) => {
    await AuthService.changePassword(res.locals.user!.id, req.body);
    ApiResponse.success(res, {
      message:
        "Password changed successfully. Please log in again with your new password.",
    });
  }),

  getMe: asyncHandler(async (_req: Request, res: Response) => {
    const user = await AuthService.getMe(res.locals.user!.id);
    ApiResponse.success(res, { data: user });
  }),
};
