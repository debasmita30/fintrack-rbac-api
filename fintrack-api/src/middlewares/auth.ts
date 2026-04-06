import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { JwtPayload } from "../types/express.d";
import prisma from "../lib/prisma";

/**
 * Verifies the JWT access token from the Authorization header.
 * Attaches the decoded user payload to res.locals.user.
 *
 * Also checks that the user is still ACTIVE in the database —
 * this prevents a deactivated user from continuing to use a valid token.
 */
export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw ApiError.unauthorized("Authorization header missing or malformed");
    }

    const token = authHeader.split(" ")[1];

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    } catch {
      throw ApiError.unauthorized("Invalid or expired access token");
    }

    // Always verify the user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, role: true, status: true },
    });

    if (!user) {
      throw ApiError.unauthorized("User account no longer exists");
    }

    if (user.status === "INACTIVE") {
      throw ApiError.forbidden("Your account has been deactivated");
    }

    res.locals.user = user as {
      id: string;
      email: string;
      name: string;
      role: "VIEWER" | "ANALYST" | "ADMIN";
      status: "ACTIVE" | "INACTIVE";
    };

    next();
  }
);
