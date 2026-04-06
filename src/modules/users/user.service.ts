import bcrypt from "bcryptjs";
import prisma from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { AuditService } from "../audit/audit.service";
import type { CreateUserInput, UpdateUserInput, ListUsersQuery } from "./user.schema";

const USER_PUBLIC_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
};

export class UserService {
  static async create(data: CreateUserInput, performedById: string) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      throw ApiError.conflict(`A user with email "${data.email}" already exists`);
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        role: data.role,
      },
      select: USER_PUBLIC_SELECT,
    });

    await AuditService.log({
      action: "CREATE",
      entity: "User",
      entityId: user.id,
      performedById,
      newData: { email: user.email, role: user.role },
    });

    return user;
  }

  static async list(query: ListUsersQuery) {
    const { page, limit, role, status, search } = query;
    const skip = (page - 1) * limit;

    const where = {
      ...(role && { role }),
      ...(status && { status }),
      ...(search && {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
        ],
      }),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: USER_PUBLIC_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total, page, limit };
  }

  static async getById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        ...USER_PUBLIC_SELECT,
        _count: { select: { transactions: true } },
      },
    });

    if (!user) throw ApiError.notFound("User");
    return user;
  }

  static async update(
    id: string,
    data: UpdateUserInput,
    performedById: string
  ) {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("User");

    // Prevent admin from deactivating themselves
    if (id === performedById && data.status === "INACTIVE") {
      throw ApiError.badRequest("You cannot deactivate your own account");
    }

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: USER_PUBLIC_SELECT,
    });

    await AuditService.log({
      action: "UPDATE",
      entity: "User",
      entityId: id,
      performedById,
      oldData: {
        role: existing.role,
        status: existing.status,
        name: existing.name,
      },
      newData: data,
    });

    return updated;
  }

  static async delete(id: string, performedById: string) {
    if (id === performedById) {
      throw ApiError.badRequest("You cannot delete your own account");
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) throw ApiError.notFound("User");

    // Soft-delete by deactivating instead of hard delete (preserves audit trail)
    await prisma.user.update({
      where: { id },
      data: { status: "INACTIVE" },
    });

    await AuditService.log({
      action: "DELETE",
      entity: "User",
      entityId: id,
      performedById,
      oldData: { email: existing.email },
    });
  }
}
