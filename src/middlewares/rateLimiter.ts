import rateLimit from "express-rate-limit";
import { env } from "../config/env";

const buildLimiter = (max: number, windowMs?: number) =>
  rateLimit({
    windowMs: windowMs ?? env.RATE_LIMIT_WINDOW_MS,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.ip ?? "unknown",
    handler: (_req, res) => {
      res.status(429).json({
        success: false,
        message: "Too many requests — please slow down and try again later",
        requestId: res.locals.requestId,
        timestamp: new Date().toISOString(),
      });
    },
  });

/** General API rate limiter: 100 req / 15 min */
export const apiLimiter = buildLimiter(env.RATE_LIMIT_MAX);

/** Strict limiter for auth endpoints: 10 attempts / 15 min */
export const authLimiter = buildLimiter(10);

/** Relaxed limiter for read-heavy dashboard endpoints */
export const dashboardLimiter = buildLimiter(200);
