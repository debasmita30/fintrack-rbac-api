import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  let statusCode = 500;
  let message = "Internal server error";
  let errors: unknown[] = [];

  const prismaCode = (err as any).code as string | undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof ZodError) {
    statusCode = 422;
    message = "Validation failed";
    errors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
      code: e.code,
    }));
  } else if (prismaCode === "P2002") {
    statusCode = 409;
    message = "A record with this value already exists";
    const target = ((err as any).meta?.target as string[]) ?? [];
    errors = [{ field: target.join(", "), message: "Must be unique" }];
  } else if (prismaCode === "P2025") {
    statusCode = 404;
    message = "Record not found";
  } else if (prismaCode?.startsWith("P")) {
    statusCode = 400;
    message = "Database operation failed";
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired";
  }

  if (statusCode === 500) {
    console.error(`[ERROR] ${req.method} ${req.path}`, {
      requestId: res.locals.requestId,
      error: err.message,
      stack: err.stack,
    });
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
    requestId: res.locals.requestId,
    timestamp: new Date().toISOString(),
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
}
