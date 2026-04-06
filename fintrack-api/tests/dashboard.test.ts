import request from "supertest";
import app from "../src/app";
import { setupTestDb, teardownTestDb, prisma } from "./setup";

describe("Dashboard Module", () => {
  let adminToken: string;
  let viewerToken: string;

  const login = async (email: string) => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email, password: "Test@1234" });
    return res.body.data.accessToken as string;
  };

  beforeAll(async () => {
    await setupTestDb();
    adminToken = await login("test-admin@fintrack.io");
    viewerToken = await login("test-viewer@fintrack.io");

    // Seed some transactions for meaningful analytics
    const adminUser = await prisma.user.findUnique({
      where: { email: "test-admin@fintrack.io" },
    });

    if (adminUser) {
      await prisma.transaction.createMany({
        data: [
          {
            amount: 5000,
            type: "INCOME",
            category: "Salary",
            date: new Date("2025-01-15"),
            createdById: adminUser.id,
            tags: "[]",
          },
          {
            amount: 1200,
            type: "EXPENSE",
            category: "Rent",
            date: new Date("2025-01-20"),
            createdById: adminUser.id,
            tags: "[]",
          },
          {
            amount: 3000,
            type: "INCOME",
            category: "Freelance",
            date: new Date("2025-02-10"),
            createdById: adminUser.id,
            tags: "[]",
          },
          {
            amount: 500,
            type: "EXPENSE",
            category: "Food & Dining",
            date: new Date("2025-02-18"),
            createdById: adminUser.id,
            tags: "[]",
          },
          {
            amount: 250,
            type: "EXPENSE",
            category: "Transport",
            date: new Date("2025-03-05"),
            createdById: adminUser.id,
            tags: "[]",
          },
        ],
      });
    }
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  // ── Summary ───────────────────────────────────────────────────────────────

  describe("GET /api/v1/dashboard/summary", () => {
    it("should return financial summary with correct totals", async () => {
      const res = await request(app)
        .get("/api/v1/dashboard/summary")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("income");
      expect(res.body.data).toHaveProperty("expenses");
      expect(res.body.data).toHaveProperty("netBalance");
      expect(res.body.data).toHaveProperty("savingsRate");
      expect(res.body.data).toHaveProperty("transactionCount");

      // income = 5000 + 3000 = 8000, expenses = 1200 + 500 + 250 = 1950
      expect(res.body.data.income).toBe(8000);
      expect(res.body.data.expenses).toBe(1950);
      expect(res.body.data.netBalance).toBe(6050);
    });

    it("viewer should also access the summary", async () => {
      const res = await request(app)
        .get("/api/v1/dashboard/summary")
        .set("Authorization", `Bearer ${viewerToken}`);

      expect(res.status).toBe(200);
    });

    it("should filter by date range", async () => {
      const res = await request(app)
        .get("/api/v1/dashboard/summary?startDate=2025-01-01&endDate=2025-01-31")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      // Only January transactions
      expect(res.body.data.income).toBe(5000);
    });

    it("should require authentication", async () => {
      const res = await request(app).get("/api/v1/dashboard/summary");
      expect(res.status).toBe(401);
    });
  });

  // ── Category Breakdown ────────────────────────────────────────────────────

  describe("GET /api/v1/dashboard/categories", () => {
    it("should return income and expense category breakdown", async () => {
      const res = await request(app)
        .get("/api/v1/dashboard/categories")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("income");
      expect(res.body.data).toHaveProperty("expenses");
      expect(Array.isArray(res.body.data.income)).toBe(true);
      expect(Array.isArray(res.body.data.expenses)).toBe(true);

      // Income categories should include Salary
      const salaryCategory = res.body.data.income.find(
        (c: { category: string }) => c.category === "Salary"
      );
      expect(salaryCategory).toBeDefined();
      expect(salaryCategory.total).toBe(5000);
    });
  });

  // ── Monthly Trends ────────────────────────────────────────────────────────

  describe("GET /api/v1/dashboard/trends/monthly", () => {
    it("should return monthly buckets", async () => {
      const res = await request(app)
        .get("/api/v1/dashboard/trends/monthly?months=6")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data).toHaveLength(6);

      // Each bucket should have month, income, expenses, net
      res.body.data.forEach((bucket: Record<string, unknown>) => {
        expect(bucket).toHaveProperty("month");
        expect(bucket).toHaveProperty("income");
        expect(bucket).toHaveProperty("expenses");
        expect(bucket).toHaveProperty("net");
      });
    });
  });

  // ── Recent Activity ───────────────────────────────────────────────────────

  describe("GET /api/v1/dashboard/recent", () => {
    it("should return recent transactions", async () => {
      const res = await request(app)
        .get("/api/v1/dashboard/recent?limit=5")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeLessThanOrEqual(5);
    });
  });

  // ── Anomaly Detection ─────────────────────────────────────────────────────

  describe("GET /api/v1/dashboard/anomalies", () => {
    it("should return anomaly detection results", async () => {
      const res = await request(app)
        .get("/api/v1/dashboard/anomalies")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      // Each anomaly should have a zScore
      res.body.data.forEach((a: Record<string, unknown>) => {
        expect(a).toHaveProperty("zScore");
        expect(a).toHaveProperty("deviation");
      });
    });
  });
});
