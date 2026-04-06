import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { env } from "../config/env";

const buildLimiter = (max: number, windowMs?: number) =>
  rateLimit({
    windowMs: windowMs ?? env.RATE_LIMIT_WINDOW_MS,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => env.NODE_ENV === "production" && process.env.DISABLE_RATE_LIMIT === "true",
    keyGenerator: (req) => ipKeyGenerator(req.ip ?? "unknown"),
    handler: (_req, res) => {
      res.status(429).json({
        success: false,
        message: "Too many requests — please slow down and try again later",
        requestId: res.locals.requestId,
        timestamp: new Date().toISOString(),
      });
    },
  });

export const apiLimiter = buildLimiter(500);
export const authLimiter = buildLimiter(50);
export const dashboardLimiter = buildLimiter(500);
