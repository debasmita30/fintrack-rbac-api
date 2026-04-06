import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import { env } from "./config/env";
import { swaggerSpec } from "./config/swagger";
import { requestIdMiddleware } from "./middlewares/requestId";
import { errorHandler } from "./middlewares/errorHandler";
import { apiLimiter } from "./middlewares/rateLimiter";

// ── Route Modules ─────────────────────────────────────────────────────────────
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import transactionRoutes from "./modules/transactions/transaction.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import auditRoutes from "./modules/audit/audit.routes";

const app = express();

// ── Security & Parsing Middleware ─────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: env.NODE_ENV === "production",
  })
);
app.use(cors({
  origin: env.NODE_ENV === "production"
    ? (process.env.FRONTEND_URL ?? "*")
    : "*",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Observability Middleware ───────────────────────────────────────────────────
app.use(requestIdMiddleware);

if (env.NODE_ENV !== "test") {
  app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms", {
      skip: (req) => req.url === "/health",
    })
  );
}

// ── Global Rate Limiter ───────────────────────────────────────────────────────
app.use("/api", apiLimiter);

// ── API Documentation ─────────────────────────────────────────────────────────
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "FinTrack API Docs",
    customCss: ".swagger-ui .topbar { display: none }",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  })
);

app.get("/api-docs.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// ── Health Check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "fintrack-api",
    version: "1.0.0",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
const API_PREFIX = "/api/v1";

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/transactions`, transactionRoutes);
app.use(`${API_PREFIX}/dashboard`, dashboardRoutes);
app.use(`${API_PREFIX}/audit`, auditRoutes);

// ── Root Info Endpoint ────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({
    name: "FinTrack API",
    version: "1.0.0",
    description: "Finance Data Processing & Access Control Backend",
    docs: `/api-docs`,
    health: `/health`,
    api: `${API_PREFIX}`,
    endpoints: {
      auth: `${API_PREFIX}/auth`,
      users: `${API_PREFIX}/users`,
      transactions: `${API_PREFIX}/transactions`,
      dashboard: `${API_PREFIX}/dashboard`,
      audit: `${API_PREFIX}/audit`,
    },
  });
});

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
    requestId: res.locals.requestId,
    timestamp: new Date().toISOString(),
  });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use(errorHandler as (err: Error, req: Request, res: Response, next: NextFunction) => void);

// ── Start Server ──────────────────────────────────────────────────────────────
if (env.NODE_ENV !== "test") {
  app.listen(env.PORT, () => {
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("  🚀  FinTrack API is running");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`  🌍  Server:  http://localhost:${env.PORT}`);
    console.log(`  📄  API:     http://localhost:${env.PORT}/api/v1`);
    console.log(`  📚  Docs:    http://localhost:${env.PORT}/api-docs`);
    console.log(`  💚  Health:  http://localhost:${env.PORT}/health`);
    console.log(`  🔧  Env:     ${env.NODE_ENV}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  });
}

export default app;
