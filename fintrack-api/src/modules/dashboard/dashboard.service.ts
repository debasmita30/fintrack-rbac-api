import prisma from "../../lib/prisma";

interface DateRangeFilter {
  userId: string;
  userRole: string;
  startDate?: Date;
  endDate?: Date;
}

interface TxRecord {
  amount: number;
  type: string;
}

interface TxWithDate extends TxRecord {
  date: Date;
}

export class DashboardService {
  private static buildWhere(userId: string, userRole: string, extra: object = {}) {
    return {
      isDeleted: false,
      ...(userRole !== "ADMIN" && { createdById: userId }),
      ...extra,
    };
  }

  static async getSummary({ userId, userRole, startDate, endDate }: DateRangeFilter) {
    const dateFilter =
      startDate || endDate
        ? { date: { ...(startDate && { gte: startDate }), ...(endDate && { lte: endDate }) } }
        : {};

    const where = DashboardService.buildWhere(userId, userRole, dateFilter);
    const transactions: TxRecord[] = await prisma.transaction.findMany({
      where,
      select: { amount: true, type: true },
    });

    const income = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0);

    const incomeCount = transactions.filter((t) => t.type === "INCOME").length;
    const expenseCount = transactions.filter((t) => t.type === "EXPENSE").length;

    return {
      income: Math.round(income * 100) / 100,
      expenses: Math.round(expenses * 100) / 100,
      netBalance: Math.round((income - expenses) * 100) / 100,
      savingsRate: income > 0 ? Math.round(((income - expenses) / income) * 10000) / 100 : 0,
      transactionCount: transactions.length,
      incomeCount,
      expenseCount,
      avgIncome: incomeCount > 0 ? Math.round((income / incomeCount) * 100) / 100 : 0,
      avgExpense: expenseCount > 0 ? Math.round((expenses / expenseCount) * 100) / 100 : 0,
      dateRange: { startDate, endDate },
    };
  }

  static async getCategoryBreakdown({ userId, userRole, startDate, endDate }: DateRangeFilter) {
    const dateFilter =
      startDate || endDate
        ? { date: { ...(startDate && { gte: startDate }), ...(endDate && { lte: endDate }) } }
        : {};

    const where = DashboardService.buildWhere(userId, userRole, dateFilter);
    const transactions: Array<TxRecord & { category: string }> =
      await prisma.transaction.findMany({
        where,
        select: { amount: true, type: true, category: true },
      });

    const buildBreakdown = (type: "INCOME" | "EXPENSE") => {
      const filtered = transactions.filter((t) => t.type === type);
      const total = filtered.reduce((s, t) => s + t.amount, 0);
      const grouped: Record<string, { total: number; count: number }> = {};
      for (const t of filtered) {
        if (!grouped[t.category]) grouped[t.category] = { total: 0, count: 0 };
        grouped[t.category].total += t.amount;
        grouped[t.category].count += 1;
      }
      return Object.entries(grouped)
        .map(([category, { total: catTotal, count }]) => ({
          category,
          total: Math.round(catTotal * 100) / 100,
          count,
          share: total > 0 ? Math.round((catTotal / total) * 10000) / 100 : 0,
        }))
        .sort((a, b) => b.total - a.total);
    };

    return { income: buildBreakdown("INCOME"), expenses: buildBreakdown("EXPENSE") };
  }

  static async getMonthlyTrends({
    userId,
    userRole,
    months = 6,
  }: {
    userId: string;
    userRole: string;
    months?: number;
  }) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months + 1);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const where = DashboardService.buildWhere(userId, userRole, { date: { gte: startDate } });
    const transactions: TxWithDate[] = await prisma.transaction.findMany({
      where,
      select: { amount: true, type: true, date: true },
      orderBy: { date: "asc" },
    });

    const monthMap: Record<string, { income: number; expenses: number; count: number }> = {};

    for (let i = 0; i < months; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - (months - 1 - i));
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthMap[key] = { income: 0, expenses: 0, count: 0 };
    }

    for (const t of transactions) {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (monthMap[key]) {
        if (t.type === "INCOME") monthMap[key].income += t.amount;
        else monthMap[key].expenses += t.amount;
        monthMap[key].count += 1;
      }
    }

    return Object.entries(monthMap).map(([month, data]) => ({
      month,
      income: Math.round(data.income * 100) / 100,
      expenses: Math.round(data.expenses * 100) / 100,
      net: Math.round((data.income - data.expenses) * 100) / 100,
      transactionCount: data.count,
    }));
  }

  static async getRecentActivity({
    userId,
    userRole,
    limit = 10,
  }: {
    userId: string;
    userRole: string;
    limit?: number;
  }) {
    const where = DashboardService.buildWhere(userId, userRole);
    return prisma.transaction.findMany({
      where,
      select: {
        id: true,
        amount: true,
        type: true,
        category: true,
        date: true,
        description: true,
        createdAt: true,
        createdBy: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: Math.min(limit, 50),
    });
  }

  static async getAnomalies({ userId, userRole }: { userId: string; userRole: string }) {
    const where = DashboardService.buildWhere(userId, userRole);
    const transactions: Array<{
      id: string;
      amount: number;
      type: string;
      category: string;
      date: Date;
      description: string | null;
    }> = await prisma.transaction.findMany({
      where,
      select: { id: true, amount: true, type: true, category: true, date: true, description: true },
    });

    const groups: Record<string, number[]> = {};
    for (const t of transactions) {
      const key = `${t.type}::${t.category}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(t.amount);
    }

    const anomalies = [];
    for (const t of transactions) {
      const key = `${t.type}::${t.category}`;
      const values = groups[key];
      if (values.length < 3) continue;
      const mean = values.reduce((s, v) => s + v, 0) / values.length;
      const stdDev = Math.sqrt(
        values.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / values.length
      );
      const zScore = stdDev > 0 ? Math.abs(t.amount - mean) / stdDev : 0;
      if (zScore > 2) {
        anomalies.push({
          ...t,
          zScore: Math.round(zScore * 100) / 100,
          mean: Math.round(mean * 100) / 100,
          stdDev: Math.round(stdDev * 100) / 100,
          deviation: t.amount > mean ? "unusually_high" : "unusually_low",
        });
      }
    }

    return anomalies.sort((a, b) => b.zScore - a.zScore).slice(0, 10);
  }

  static async getWeeklyFlow({ userId, userRole }: { userId: string; userRole: string }) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const where = DashboardService.buildWhere(userId, userRole, { date: { gte: startOfMonth } });

    const transactions: TxWithDate[] = await prisma.transaction.findMany({
      where,
      select: { amount: true, type: true, date: true },
    });

    const weeks: Record<number, { income: number; expenses: number }> = {
      1: { income: 0, expenses: 0 },
      2: { income: 0, expenses: 0 },
      3: { income: 0, expenses: 0 },
      4: { income: 0, expenses: 0 },
    };

    for (const t of transactions) {
      const day = new Date(t.date).getDate();
      const week = Math.min(4, Math.ceil(day / 7));
      if (t.type === "INCOME") weeks[week].income += t.amount;
      else weeks[week].expenses += t.amount;
    }

    return Object.entries(weeks).map(([week, data]) => ({
      week: `Week ${week}`,
      income: Math.round(data.income * 100) / 100,
      expenses: Math.round(data.expenses * 100) / 100,
      net: Math.round((data.income - data.expenses) * 100) / 100,
    }));
  }
}
