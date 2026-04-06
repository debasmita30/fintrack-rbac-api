import { z } from "zod";

const TRANSACTION_TYPES = ["INCOME", "EXPENSE"] as const;

const CATEGORIES = [
  "Salary",
  "Freelance",
  "Investment",
  "Food & Dining",
  "Transport",
  "Utilities",
  "Healthcare",
  "Entertainment",
  "Shopping",
  "Education",
  "Rent",
  "Insurance",
  "Other",
] as const;

export const createTransactionSchema = z.object({
  amount: z
    .number({ required_error: "Amount is required" })
    .positive("Amount must be a positive number")
    .max(999_999_999, "Amount is unrealistically large"),
  type: z.enum(TRANSACTION_TYPES, {
    errorMap: () => ({
      message: `Type must be one of: ${TRANSACTION_TYPES.join(", ")}`,
    }),
  }),
  category: z
    .string({ required_error: "Category is required" })
    .min(1, "Category is required")
    .max(50),
  date: z.coerce
    .date({ required_error: "Date is required" })
    .max(new Date(), "Date cannot be in the future"),
  description: z.string().max(255).optional(),
  notes: z.string().max(1000).optional(),
  tags: z.array(z.string().max(30)).max(10).default([]),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const listTransactionsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  type: z.enum(TRANSACTION_TYPES).optional(),
  category: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  minAmount: z.coerce.number().min(0).optional(),
  maxAmount: z.coerce.number().min(0).optional(),
  search: z.string().optional(),
  sortBy: z
    .enum(["date", "amount", "createdAt", "category"])
    .default("date"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  includeDeleted: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .default("false"),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type ListTransactionsQuery = z.infer<typeof listTransactionsQuerySchema>;
