import { Request } from "express";

export interface PaginationQuery {
  page: number;
  limit: number;
  skip: number;
}

/**
 * Extract and validate pagination params from query string.
 * Defaults: page=1, limit=10. Max limit: 100.
 */
export function getPagination(req: Request): PaginationQuery {
  const page = Math.max(1, parseInt(String(req.query.page ?? "1"), 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(String(req.query.limit ?? "10"), 10) || 10)
  );
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
