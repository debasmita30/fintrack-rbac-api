import { z } from "zod";

const ROLES = ["VIEWER", "ANALYST", "ADMIN"] as const;
const STATUSES = ["ACTIVE", "INACTIVE"] as const;

export const createUserSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format")
    .toLowerCase(),
  name: z
    .string({ required_error: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(100),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Password must contain uppercase, lowercase, number, and special character"
    ),
  role: z.enum(ROLES, {
    errorMap: () => ({ message: `Role must be one of: ${ROLES.join(", ")}` }),
  }).default("VIEWER"),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  role: z.enum(ROLES).optional(),
  status: z.enum(STATUSES).optional(),
});

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  role: z.enum(ROLES).optional(),
  status: z.enum(STATUSES).optional(),
  search: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
