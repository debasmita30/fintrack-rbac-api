import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Use a separate in-memory SQLite DB for tests
process.env.DATABASE_URL = "file:./test.db";
process.env.NODE_ENV = "test";
process.env.JWT_ACCESS_SECRET = "test_access_secret";
process.env.JWT_REFRESH_SECRET = "test_refresh_secret";
process.env.JWT_ACCESS_EXPIRES_IN = "15m";
process.env.JWT_REFRESH_EXPIRES_IN = "7d";

export const prisma = new PrismaClient({
  datasources: { db: { url: "file:./test.db" } },
});

export let adminToken = "";
export let analystToken = "";
export let viewerToken = "";

export let adminId = "";
export let analystId = "";
export let viewerId = "";

export async function setupTestDb() {
  // Run migrations
  const { execSync } = await import("child_process");
  execSync("npx prisma db push --force-reset", {
    env: { ...process.env, DATABASE_URL: "file:./test.db" },
    stdio: "pipe",
  });

  const password = await bcrypt.hash("Test@1234", 12);

  const admin = await prisma.user.create({
    data: {
      email: "test-admin@fintrack.io",
      name: "Test Admin",
      password,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  const analyst = await prisma.user.create({
    data: {
      email: "test-analyst@fintrack.io",
      name: "Test Analyst",
      password,
      role: "ANALYST",
      status: "ACTIVE",
    },
  });

  const viewer = await prisma.user.create({
    data: {
      email: "test-viewer@fintrack.io",
      name: "Test Viewer",
      password,
      role: "VIEWER",
      status: "ACTIVE",
    },
  });

  adminId = admin.id;
  analystId = analyst.id;
  viewerId = viewer.id;

  return { admin, analyst, viewer };
}

export async function teardownTestDb() {
  await prisma.auditLog.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
}
