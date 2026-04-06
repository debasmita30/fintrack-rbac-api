import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import prisma from "../../lib/prisma";
import { env } from "../../config/env";
import { ApiError } from "../../utils/ApiError";
import { AuditService } from "../audit/audit.service";
import type { LoginInput, ChangePasswordInput } from "./auth.schema";

export class AuthService {
  private static generateAccessToken(user: {
    id: string;
    email: string;
    name: string;
    role: string;
  }) {
    return jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
    );
  }

  private static generateRefreshToken() {
    return uuidv4() + "-" + uuidv4(); // Opaque refresh token (not JWT)
  }

  static async login(
    data: LoginInput,
    meta: { ipAddress?: string; userAgent?: string }
  ) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      // Timing-safe: still run bcrypt to prevent user enumeration via response time
      await bcrypt.compare(data.password, "$2b$12$invalidhashinvalidhash12345678");
      throw ApiError.unauthorized("Invalid email or password");
    }

    if (user.status === "INACTIVE") {
      throw ApiError.forbidden("Your account has been deactivated. Contact admin.");
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password);
    if (!passwordMatch) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    // Issue tokens
    const accessToken = AuthService.generateAccessToken(user);
    const rawRefreshToken = AuthService.generateRefreshToken();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.refreshToken.create({
      data: {
        token: rawRefreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    // Audit log
    await AuditService.log({
      action: "LOGIN",
      entity: "User",
      entityId: user.id,
      performedById: user.id,
      newData: { email: user.email, role: user.role },
      ...meta,
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  static async refreshTokens(token: string) {
    const stored = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!stored || stored.isRevoked || stored.expiresAt < new Date()) {
      throw ApiError.unauthorized("Refresh token is invalid or expired");
    }

    if (stored.user.status === "INACTIVE") {
      throw ApiError.forbidden("Account has been deactivated");
    }

    // Rotate: revoke old token, issue new pair
    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { isRevoked: true },
    });

    const newAccessToken = AuthService.generateAccessToken(stored.user);
    const newRawRefresh = AuthService.generateRefreshToken();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: newRawRefresh,
        userId: stored.user.id,
        expiresAt,
      },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRawRefresh,
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    };
  }

  static async logout(
    refreshToken: string | undefined,
    userId: string
  ) {
    if (refreshToken) {
      await prisma.refreshToken.updateMany({
        where: { token: refreshToken, userId },
        data: { isRevoked: true },
      });
    }

    await AuditService.log({
      action: "LOGOUT",
      entity: "User",
      entityId: userId,
      performedById: userId,
    });
  }

  static async changePassword(
    userId: string,
    data: ChangePasswordInput
  ) {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

    const valid = await bcrypt.compare(data.currentPassword, user.password);
    if (!valid) {
      throw ApiError.badRequest("Current password is incorrect");
    }

    const hashed = await bcrypt.hash(data.newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    // Revoke all existing refresh tokens (force re-login everywhere)
    await prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });

    await AuditService.log({
      action: "UPDATE",
      entity: "User",
      entityId: userId,
      performedById: userId,
      newData: { action: "password_changed" },
    });
  }

  static async getMe(userId: string) {
    return prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
  }
}
