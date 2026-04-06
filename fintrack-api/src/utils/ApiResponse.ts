import { Response } from "express";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export class ApiResponse {
  /**
   * Send a successful response with optional data and pagination
   */
  static success(
    res: Response,
    {
      message = "Success",
      data = null,
      statusCode = 200,
      pagination,
    }: {
      message?: string;
      data?: unknown;
      statusCode?: number;
      pagination?: PaginationMeta;
    } = {}
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      ...(pagination && { pagination }),
      requestId: res.locals.requestId,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Send a 201 Created response
   */
  static created(
    res: Response,
    { message = "Created successfully", data = null }: { message?: string; data?: unknown } = {}
  ) {
    return ApiResponse.success(res, { message, data, statusCode: 201 });
  }

  /**
   * Build pagination metadata from query params and total count
   */
  static buildPagination(
    page: number,
    limit: number,
    total: number
  ): PaginationMeta {
    const totalPages = Math.ceil(total / limit);
    return {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }
}
