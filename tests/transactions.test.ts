import request from "supertest";
import app from "../src/app";
import { setupTestDb, teardownTestDb, prisma } from "./setup";

describe("Transactions Module", () => {
  let adminToken: string;
  let analystToken: string;
  let viewerToken: string;
  let createdTxId: string;

  const login = async (email: string) => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email, password: "Test@1234" });
    return res.body.data.accessToken as string;
  };

  beforeAll(async () => {
    await setupTestDb();
    adminToken = await login("test-admin@fintrack.io");
    analystToken = await login("test-analyst@fintrack.io");
    viewerToken = await login("test-viewer@fintrack.io");
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  const validTransaction = {
    amount: 1500.5,
    type: "INCOME",
    category: "Salary",
    date: "2025-03-01",
    description: "March salary",
    notes: "Includes bonus",
    tags: ["salary", "recurring"],
  };

  // ── Create ───────────────────────────────────────────────────────────────

  describe("POST /api/v1/transactions", () => {
    it("analyst should create a transaction", async () => {
      const res = await request(app)
        .post("/api/v1/transactions")
        .set("Authorization", `Bearer ${analystToken}`)
        .send(validTransaction);

      expect(res.status).toBe(201);
      expect(res.body.data.amount).toBe(1500.5);
      expect(res.body.data.tags).toEqual(["salary", "recurring"]);
      createdTxId = res.body.data.id;
    });

    it("admin should create a transaction", async () => {
      const res = await request(app)
        .post("/api/v1/transactions")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ ...validTransaction, category: "Freelance", amount: 800 });

      expect(res.status).toBe(201);
    });

    it("viewer should NOT be able to create transactions", async () => {
      const res = await request(app)
        .post("/api/v1/transactions")
        .set("Authorization", `Bearer ${viewerToken}`)
        .send(validTransaction);

      expect(res.status).toBe(403);
    });

    it("should reject negative amount", async () => {
      const res = await request(app)
        .post("/api/v1/transactions")
        .set("Authorization", `Bearer ${analystToken}`)
        .send({ ...validTransaction, amount: -100 });

      expect(res.status).toBe(422);
      expect(res.body.errors[0].field).toBe("amount");
    });

    it("should reject future date", async () => {
      const future = new Date();
      future.setFullYear(future.getFullYear() + 1);
      const res = await request(app)
        .post("/api/v1/transactions")
        .set("Authorization", `Bearer ${analystToken}`)
        .send({ ...validTransaction, date: future.toISOString() });

      expect(res.status).toBe(422);
    });

    it("should reject invalid transaction type", async () => {
      const res = await request(app)
        .post("/api/v1/transactions")
        .set("Authorization", `Bearer ${analystToken}`)
        .send({ ...validTransaction, type: "TRANSFER" });

      expect(res.status).toBe(422);
    });
  });

  // ── List ─────────────────────────────────────────────────────────────────

  describe("GET /api/v1/transactions", () => {
    it("should return paginated list for admin", async () => {
      const res = await request(app)
        .get("/api/v1/transactions?page=1&limit=5")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.pagination).toMatchObject({
        page: 1,
        limit: 5,
      });
    });

    it("should filter by type", async () => {
      const res = await request(app)
        .get("/api/v1/transactions?type=INCOME")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      res.body.data.forEach((tx: { type: string }) => {
        expect(tx.type).toBe("INCOME");
      });
    });

    it("should filter by category", async () => {
      const res = await request(app)
        .get("/api/v1/transactions?category=Salary")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      res.body.data.forEach((tx: { category: string }) => {
        expect(tx.category).toContain("Salary");
      });
    });

    it("should reject unauthenticated access", async () => {
      const res = await request(app).get("/api/v1/transactions");
      expect(res.status).toBe(401);
    });
  });

  // ── Get By ID ─────────────────────────────────────────────────────────────

  describe("GET /api/v1/transactions/:id", () => {
    it("should return a specific transaction", async () => {
      const res = await request(app)
        .get(`/api/v1/transactions/${createdTxId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(createdTxId);
    });

    it("should return 404 for non-existent ID", async () => {
      const res = await request(app)
        .get("/api/v1/transactions/nonexistent-id-000")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });
  });

  // ── Update ────────────────────────────────────────────────────────────────

  describe("PATCH /api/v1/transactions/:id", () => {
    it("analyst should update their own transaction", async () => {
      const res = await request(app)
        .patch(`/api/v1/transactions/${createdTxId}`)
        .set("Authorization", `Bearer ${analystToken}`)
        .send({ amount: 2000, description: "Updated description" });

      expect(res.status).toBe(200);
      expect(res.body.data.amount).toBe(2000);
    });

    it("viewer should NOT be able to update", async () => {
      const res = await request(app)
        .patch(`/api/v1/transactions/${createdTxId}`)
        .set("Authorization", `Bearer ${viewerToken}`)
        .send({ amount: 9999 });

      expect(res.status).toBe(403);
    });
  });

  // ── Soft Delete & Restore ─────────────────────────────────────────────────

  describe("DELETE /api/v1/transactions/:id and POST /:id/restore", () => {
    it("analyst should soft-delete a transaction", async () => {
      const res = await request(app)
        .delete(`/api/v1/transactions/${createdTxId}`)
        .set("Authorization", `Bearer ${analystToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/soft delete/i);
    });

    it("deleted transaction should not appear in default listing", async () => {
      const res = await request(app)
        .get("/api/v1/transactions")
        .set("Authorization", `Bearer ${adminToken}`);

      const found = res.body.data.find((t: { id: string }) => t.id === createdTxId);
      expect(found).toBeUndefined();
    });

    it("admin should restore a soft-deleted transaction", async () => {
      const res = await request(app)
        .post(`/api/v1/transactions/${createdTxId}/restore`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.isDeleted).toBe(false);
    });

    it("viewer cannot restore transactions", async () => {
      const res = await request(app)
        .post(`/api/v1/transactions/${createdTxId}/restore`)
        .set("Authorization", `Bearer ${viewerToken}`);

      expect(res.status).toBe(403);
    });
  });
});
