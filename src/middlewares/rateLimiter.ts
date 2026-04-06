import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { env } from "../config/env";

const buildLimiter = (max: number, windowMs?: number) =>
  rateLimit({
    windowMs: windowMs ?? env.RATE_LIMIT_WINDOW_MS,
    max,
    standardHeaders: true,
    legacyHeaders: false,
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

export const apiLimiter = buildLimiter(env.RATE_LIMIT_MAX);
export const authLimiter = buildLimiter(10);
export const dashboardLimiter = buildLimiter(200);
