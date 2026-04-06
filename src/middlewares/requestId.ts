import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

/**
 * Injects a unique request ID into every request for distributed tracing.
 * Checks for an incoming X-Request-ID header (from upstream proxy/gateway)
 * before generating a fresh UUID.
 */
export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const requestId =
    (req.headers["x-request-id"] as string) ?? uuidv4();

  res.locals.requestId = requestId;
  res.setHeader("X-Request-ID", requestId);

  next();
}
