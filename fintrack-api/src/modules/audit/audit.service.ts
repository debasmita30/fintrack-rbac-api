import prisma from "../../lib/prisma";

interface AuditLogPayload {
  action: string;
  entity: string;
  entityId: string;
  performedById: string;
  oldData?: unknown;
  newData?: unknown;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * AuditService provides a single static method to record any state-changing
 * event in the system. Every create, update, delete, restore, login and logout
 * flows through here, creating a tamper-evident history.
 *
 * Note: Audit logs intentionally do NOT cascade-delete with transactions —
 * they preserve the full history even after soft-deletes.
 */
export class AuditService {
  static async log(payload: AuditLogPayload): Promise<void> {
    try {
      // For Transaction entity, only log if it's an actual transaction ID
      // For User entity or non-transaction entities, skip the relation
      const isTransactionEntity = payload.entity === "Transaction";

      if (isTransactionEntity) {
        // Check if transaction exists before trying to relate
        const txExists = await prisma.transaction.findUnique({
          where: { id: payload.entityId },
          select: { id: true },
        });

        if (txExists) {
          await prisma.auditLog.create({
            data: {
              action: payload.action,
              entity: payload.entity,
              entityId: payload.entityId,
              performedById: payload.performedById,
              oldData: payload.oldData
                ? JSON.stringify(payload.oldData)
                : null,
              newData: payload.newData
                ? JSON.stringify(payload.newData)
                : null,
              ipAddress: payload.ipAddress,
              userAgent: payload.userAgent,
            },
          });
          return;
        }
      }

      // For non-transaction entities (User, etc.), create without the relation
      await prisma.$executeRaw`
        INSERT INTO audit_logs (id, action, entity, "entityId", "performedById", "oldData", "newData", "ipAddress", "userAgent", "createdAt")
        VALUES (
          ${require("uuid").v4()},
          ${payload.action},
          ${payload.entity},
          ${payload.entityId},
          ${payload.performedById},
          ${payload.oldData ? JSON.stringify(payload.oldData) : null},
          ${payload.newData ? JSON.stringify(payload.newData) : null},
          ${payload.ipAddress ?? null},
          ${payload.userAgent ?? null},
          ${new Date().toISOString()}
        )
      `;
    } catch (err) {
      // Audit failures must NEVER crash the main request
      console.error("[AuditService] Failed to write audit log:", err);
    }
  }

  static async getByEntity(entity: string, entityId: string) {
    return prisma.auditLog.findMany({
      where: { entity, entityId },
      include: {
        performedBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async listAll(opts: {
    page: number;
    limit: number;
    action?: string;
    entity?: string;
    performedById?: string;
  }) {
    const { page, limit, action, entity, performedById } = opts;
    const skip = (page - 1) * limit;

    const where = {
      ...(action && { action }),
      ...(entity && { entity }),
      ...(performedById && { performedById }),
    };

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          performedBy: { select: { id: true, name: true, email: true, role: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { logs, total, page, limit };
  }
}
