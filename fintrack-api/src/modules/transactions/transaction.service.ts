import prisma from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { AuditService } from "../audit/audit.service";
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
  ListTransactionsQuery,
} from "./transaction.schema";

const TX_SELECT = {
  id: true,
  amount: true,
  type: true,
  category: true,
  date: true,
  description: true,
  notes: true,
  tags: true,
  isDeleted: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
  createdBy: {
    select: { id: true, name: true, email: true },
  },
};

export class TransactionService {
  static async create(data: CreateTransactionInput, userId: string) {
    const tx = await prisma.transaction.create({
      data: {
        amount: data.amount,
        type: data.type,
        category: data.category,
        date: data.date,
        description: data.description,
        notes: data.notes,
        tags: JSON.stringify(data.tags ?? []),
        createdById: userId,
      },
      select: TX_SELECT,
    });

    await AuditService.log({
      action: "CREATE",
      entity: "Transaction",
      entityId: tx.id,
      performedById: userId,
      newData: {
        amount: tx.amount,
        type: tx.type,
        category: tx.category,
        date: tx.date,
      },
    });

    return TransactionService.parseTags(tx);
  }

  static async list(query: ListTransactionsQuery, userId: string, userRole: string) {
    const {
      page,
      limit,
      type,
      category,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      search,
      sortBy,
      sortOrder,
      includeDeleted,
    } = query;

    const skip = (page - 1) * limit;

    // Viewers and analysts can only see their own transactions unless admin
    const ownerFilter =
      userRole === "ADMIN" ? {} : { createdById: userId };

    const where = {
      ...ownerFilter,
      isDeleted: includeDeleted ? undefined : false,
      ...(type && { type }),
      ...(category && { category: { contains: category } }),
      ...(startDate && { date: { gte: startDate } }),
      ...(endDate && {
        date: { ...(startDate ? { gte: startDate } : {}), lte: endDate },
      }),
      ...(minAmount !== undefined && { amount: { gte: minAmount } }),
      ...(maxAmount !== undefined && {
        amount: {
          ...(minAmount !== undefined ? { gte: minAmount } : {}),
          lte: maxAmount,
        },
      }),
      ...(search && {
        OR: [
          { description: { contains: search } },
          { notes: { contains: search } },
          { category: { contains: search } },
        ],
      }),
    };

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        select: TX_SELECT,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.transaction.count({ where }),
    ]);

    return {
      transactions: transactions.map(TransactionService.parseTags),
      total,
      page,
      limit,
    };
  }

  static async getById(id: string, userId: string, userRole: string) {
    const tx = await prisma.transaction.findUnique({
      where: { id },
      select: TX_SELECT,
    });

    if (!tx || tx.isDeleted) throw ApiError.notFound("Transaction");

    // Non-admins can only view their own transactions
    if (userRole !== "ADMIN" && tx.createdBy.id !== userId) {
      throw ApiError.forbidden();
    }

    return TransactionService.parseTags(tx);
  }

  static async update(
    id: string,
    data: UpdateTransactionInput,
    userId: string,
    userRole: string
  ) {
    const existing = await prisma.transaction.findUnique({ where: { id } });

    if (!existing || existing.isDeleted) throw ApiError.notFound("Transaction");

    if (userRole !== "ADMIN" && existing.createdById !== userId) {
      throw ApiError.forbidden();
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        ...(data.amount !== undefined && { amount: data.amount }),
        ...(data.type && { type: data.type }),
        ...(data.category && { category: data.category }),
        ...(data.date && { date: data.date }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.tags !== undefined && { tags: JSON.stringify(data.tags) }),
      },
      select: TX_SELECT,
    });

    await AuditService.log({
      action: "UPDATE",
      entity: "Transaction",
      entityId: id,
      performedById: userId,
      oldData: {
        amount: existing.amount,
        type: existing.type,
        category: existing.category,
      },
      newData: data,
    });

    return TransactionService.parseTags(updated);
  }

  static async softDelete(id: string, userId: string, userRole: string) {
    const existing = await prisma.transaction.findUnique({ where: { id } });

    if (!existing || existing.isDeleted) throw ApiError.notFound("Transaction");

    if (userRole !== "ADMIN" && existing.createdById !== userId) {
      throw ApiError.forbidden();
    }

    await prisma.transaction.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    await AuditService.log({
      action: "DELETE",
      entity: "Transaction",
      entityId: id,
      performedById: userId,
      oldData: { amount: existing.amount, type: existing.type },
    });
  }

  static async restore(id: string, userId: string) {
    const existing = await prisma.transaction.findUnique({ where: { id } });

    if (!existing) throw ApiError.notFound("Transaction");
    if (!existing.isDeleted) {
      throw ApiError.badRequest("Transaction is not deleted");
    }

    const restored = await prisma.transaction.update({
      where: { id },
      data: { isDeleted: false, deletedAt: null },
      select: TX_SELECT,
    });

    await AuditService.log({
      action: "RESTORE",
      entity: "Transaction",
      entityId: id,
      performedById: userId,
    });

    return TransactionService.parseTags(restored);
  }

  /**
   * Build an array of plain objects suitable for CSV export.
   * Admin only — returns all transactions in a flat format.
   */
  static async exportCsv(userId: string, userRole: string) {
    const ownerFilter = userRole === "ADMIN" ? {} : { createdById: userId };

    const transactions = await prisma.transaction.findMany({
      where: { ...ownerFilter, isDeleted: false },
      select: TX_SELECT,
      orderBy: { date: "desc" },
    });

    const txList: Array<typeof transactions[0]> = transactions;
    return txList.map((t) => ({
      id: t.id,
      amount: t.amount,
      type: t.type,
      category: t.category,
      date: new Date(t.date).toISOString().split("T")[0],
      description: t.description ?? "",
      notes: t.notes ?? "",
      tags: JSON.parse(t.tags || "[]").join("|"),
      createdBy: t.createdBy.name,
      createdAt: new Date(t.createdAt).toISOString(),
    }));
  }

  /** Parse the JSON tags string back to an array */
  private static parseTags<T extends { tags: string }>(tx: T) {
    return {
      ...tx,
      tags: (() => {
        try {
          return JSON.parse(tx.tags || "[]");
        } catch {
          return [];
        }
      })(),
    };
  }
}
