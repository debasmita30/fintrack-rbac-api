import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";
import { UserService } from "./user.service";

export const UserController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.create(req.body, res.locals.user!.id);
    ApiResponse.created(res, {
      message: "User created successfully",
      data: user,
    });
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const { users, total, page, limit } = await UserService.list(req.query as any);
    ApiResponse.success(res, {
      data: users,
      pagination: ApiResponse.buildPagination(page, limit, total),
    });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.getById(String(req.params.id));
    ApiResponse.success(res, { data: user });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.update(
      String(req.params.id),
      req.body,
      res.locals.user!.id
    );
    ApiResponse.success(res, {
      message: "User updated successfully",
      data: user,
    });
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await UserService.delete(String(req.params.id), res.locals.user!.id);
    ApiResponse.success(res, { message: "User deactivated successfully" });
  }),
};
