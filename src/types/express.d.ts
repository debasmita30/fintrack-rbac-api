import "express";

declare module "express" {
  interface Locals {
    requestId: string;
    user?: {
      id: string;
      email: string;
      name: string;
      role: "VIEWER" | "ANALYST" | "ADMIN";
      status: "ACTIVE" | "INACTIVE";
    };
  }
}

// User payload decoded from JWT
export interface JwtPayload {
  id: string;
  email: string;
  name: string;
  role: "VIEWER" | "ANALYST" | "ADMIN";
  iat?: number;
  exp?: number;
}
