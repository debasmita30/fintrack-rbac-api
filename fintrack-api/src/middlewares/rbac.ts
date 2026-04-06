import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

type Role = "VIEWER" | "ANALYST" | "ADMIN";

/**
 * Role hierarchy: ADMIN > ANALYST > VIEWER
 * A role with higher privileges implicitly includes all lower privileges.
 */
const ROLE_HIERARCHY: Record<Role, number> = {
  VIEWER: 1,
  ANALYST: 2,
  ADMIN: 3,
};

/**
 * Middleware factory — restricts access to users whose role meets the minimum
 * required level. Must be used after `authenticate` middleware.
 *
 * Usage:
 *   router.post("/records", authenticate, requireRole("ANALYST"), handler)
 *   router.delete("/records/:id", authenticate, requireRole("ADMIN"), handler)
 */
export function requireRole(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (!user) {
      return next(ApiError.unauthorized());
    }

    const userLevel = ROLE_HIERARCHY[user.role as Role] ?? 0;
    const hasAccess = allowedRoles.some(
      (role) => userLevel >= ROLE_HIERARCHY[role]
    );

    if (!hasAccess) {
      return next(
        ApiError.forbidden(
          `This action requires one of the following roles: ${allowedRoles.join(", ")}`
        )
      );
    }

    return next();
  };
}

/**
 * Convenience guard — only ADMINs allowed.
 */
export const adminOnly = requireRole("ADMIN");

/**
 * Convenience guard — ANALYSTs and above allowed.
 */
export const analystAndAbove = requireRole("ANALYST");
