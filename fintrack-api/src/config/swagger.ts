import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FinTrack API",
      version: "1.0.0",
      description: `
## Finance Data Processing & Access Control API

A production-grade backend for a finance dashboard system supporting:
- 🔐 JWT Authentication with Refresh Token Rotation
- 👥 Role-based Access Control (VIEWER | ANALYST | ADMIN)
- 💰 Financial Records Management with Soft Delete
- 📊 Advanced Dashboard Analytics & Trend Reports
- 📝 Comprehensive Audit Trail
- 📤 CSV Export

### Test Credentials
All accounts use password: \`Password@123\`

| Email | Role |
|-------|------|
| admin@fintrack.io | ADMIN |
| analyst@fintrack.io | ANALYST |
| viewer@fintrack.io | VIEWER |
      `,
      contact: {
        name: "API Support",
        email: "admin@fintrack.io",
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}/api/v1`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter the access token obtained from /auth/login",
        },
      },
      schemas: {
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data: { type: "object" },
            requestId: { type: "string" },
            timestamp: { type: "string", format: "date-time" },
          },
        },
        ApiError: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
            errors: { type: "array", items: { type: "object" } },
            requestId: { type: "string" },
            timestamp: { type: "string", format: "date-time" },
          },
        },
        Pagination: {
          type: "object",
          properties: {
            page: { type: "integer" },
            limit: { type: "integer" },
            total: { type: "integer" },
            totalPages: { type: "integer" },
            hasNext: { type: "boolean" },
            hasPrev: { type: "boolean" },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/modules/**/*.routes.ts", "./src/modules/**/*.schema.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
