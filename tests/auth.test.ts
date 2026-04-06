import request from "supertest";
import app from "../src/app";
import { setupTestDb, teardownTestDb, prisma } from "./setup";

describe("Auth Module", () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  let accessToken: string;
  let refreshToken: string;

  // ── Login ────────────────────────────────────────────────────────────────

  describe("POST /api/v1/auth/login", () => {
    it("should login successfully with valid credentials", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "test-admin@fintrack.io", password: "Test@1234" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("accessToken");
      expect(res.body.data).toHaveProperty("refreshToken");
      expect(res.body.data.user.role).toBe("ADMIN");
      expect(res.body.requestId).toBeDefined();

      accessToken = res.body.data.accessToken;
      refreshToken = res.body.data.refreshToken;
    });

    it("should reject invalid password", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "test-admin@fintrack.io", password: "WrongPass@1" });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid/i);
    });

    it("should reject non-existent email", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "ghost@fintrack.io", password: "Test@1234" });

      expect(res.status).toBe(401);
    });

    it("should return 422 for missing email", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ password: "Test@1234" });

      expect(res.status).toBe(422);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors[0].field).toBe("email");
    });

    it("should return 422 for invalid email format", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "not-an-email", password: "Test@1234" });

      expect(res.status).toBe(422);
    });
  });

  // ── Get Me ───────────────────────────────────────────────────────────────

  describe("GET /api/v1/auth/me", () => {
    it("should return current user profile", async () => {
      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe("test-admin@fintrack.io");
      expect(res.body.data).not.toHaveProperty("password");
    });

    it("should reject unauthenticated request", async () => {
      const res = await request(app).get("/api/v1/auth/me");
      expect(res.status).toBe(401);
    });

    it("should reject malformed bearer token", async () => {
      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", "Bearer invalid.token.here");
      expect(res.status).toBe(401);
    });
  });

  // ── Refresh ──────────────────────────────────────────────────────────────

  describe("POST /api/v1/auth/refresh", () => {
    it("should issue new token pair using valid refresh token", async () => {
      const res = await request(app)
        .post("/api/v1/auth/refresh")
        .send({ refreshToken });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("accessToken");
      expect(res.body.data).toHaveProperty("refreshToken");

      // Old refresh token should now be revoked (rotation)
      const revokedCheck = await request(app)
        .post("/api/v1/auth/refresh")
        .send({ refreshToken });
      expect(revokedCheck.status).toBe(401);

      // Update tokens for subsequent tests
      accessToken = res.body.data.accessToken;
      refreshToken = res.body.data.refreshToken;
    });

    it("should reject missing refresh token", async () => {
      const res = await request(app)
        .post("/api/v1/auth/refresh")
        .send({});
      expect(res.status).toBe(422);
    });
  });

  // ── Logout ───────────────────────────────────────────────────────────────

  describe("POST /api/v1/auth/logout", () => {
    it("should logout and revoke refresh token", async () => {
      const res = await request(app)
        .post("/api/v1/auth/logout")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ refreshToken });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
