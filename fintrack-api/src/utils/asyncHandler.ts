import { Request, Response, NextFunction } from "express";

/**
 * Wraps async route handlers to automatically forward errors to Express
 * error-handling middleware, eliminating repetitive try-catch blocks.
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
