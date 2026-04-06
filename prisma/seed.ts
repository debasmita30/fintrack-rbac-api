import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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
];

const expenseCategories = [
  "Food & Dining",
  "Transport",
  "Utilities",
  "Healthcare",
  "Entertainment",
  "Shopping",
  "Education",
  "Rent",
  "Insurance",
];

function randomBetween(min: number, max: number) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function randomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

async function main() {
  console.log("🌱 Seeding database...\n");

  await prisma.auditLog.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("Password@123", 12);

  const admin = await prisma.user.create({
    data: {
      email: "admin@fintrack.io",
      name: "Alice (Admin)",
      password: hashedPassword,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  const analyst = await prisma.user.create({
    data: {
      email: "analyst@fintrack.io",
      name: "Bob (Analyst)",
      password: hashedPassword,
      role: "ANALYST",
      status: "ACTIVE",
    },
  });

  const viewer = await prisma.user.create({
    data: {
      email: "viewer@fintrack.io",
      name: "Charlie (Viewer)",
      password: hashedPassword,
      role: "VIEWER",
      status: "ACTIVE",
    },
  });

  await prisma.user.create({
    data: {
      email: "inactive@fintrack.io",
      name: "Dave (Inactive)",
      password: hashedPassword,
      role: "VIEWER",
      status: "INACTIVE",
    },
  });

  console.log("✅ Created 4 users");

  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

  const transactionData: any[] = [];

  // ── Admin income transactions ─────────────────────────────────────────────
  for (let i = 0; i < 24; i++) {
    const isRecurring = i % 4 === 0;
    transactionData.push({
      amount: isRecurring
        ? randomBetween(3000, 8000)
        : randomBetween(500, 2000),
      type: "INCOME",
      category: isRecurring ? "Salary" : ["Freelance", "Investment"][i % 2],
      date: randomDate(sixMonthsAgo, now),
      description: isRecurring ? "Monthly salary credit" : "Side income",
      notes: isRecurring ? "Recurring monthly income" : null,
      tags: JSON.stringify(isRecurring ? ["recurring", "salary"] : ["income"]),
      createdById: admin.id,
    });
  }

  // ── Admin expense transactions ────────────────────────────────────────────
  for (let i = 0; i < 60; i++) {
    const category = expenseCategories[i % expenseCategories.length];
    // Every 10th transaction is a deliberate spike to trigger anomaly detection
    const isSpike = i % 10 === 0;
    transactionData.push({
      amount: isSpike ? randomBetween(8000, 15000) : randomBetween(50, 400),
      type: "EXPENSE",
      category,
      date: randomDate(sixMonthsAgo, now),
      description: isSpike ? `Unusual ${category} spike` : `${category} expense`,
      notes: isSpike ? "Flagged as anomaly" : null,
      tags: JSON.stringify(isSpike ? ["spike", "anomaly"] : ["expense"]),
      createdById: admin.id,
    });
  }

  // ── Admin soft-deleted transactions ───────────────────────────────────────
  for (let i = 0; i < 5; i++) {
    transactionData.push({
      amount: randomBetween(100, 500),
      type: "EXPENSE",
      category: "Shopping",
      date: randomDate(sixMonthsAgo, now),
      description: "Deleted transaction (for demo)",
      notes: null,
      tags: JSON.stringify(["deleted"]),
      isDeleted: true,
      deletedAt: new Date(),
      createdById: admin.id,
    });
  }

  // ── Analyst expense transactions ──────────────────────────────────────────
  for (let i = 0; i < 20; i++) {
    const category = expenseCategories[i % expenseCategories.length];
    const isSpike = i % 5 === 0;
    transactionData.push({
      amount: isSpike ? randomBetween(8000, 15000) : randomBetween(50, 400),
      type: "EXPENSE",
      category,
      date: randomDate(sixMonthsAgo, now),
      description: isSpike ? `Unusual ${category} spike` : `${category} expense`,
      notes: isSpike ? "Flagged as anomaly" : null,
      tags: JSON.stringify(isSpike ? ["spike", "anomaly"] : ["expense"]),
      createdById: analyst.id,
    });
  }

  // ── Analyst income transactions ───────────────────────────────────────────
  for (let i = 0; i < 10; i++) {
    transactionData.push({
      amount: randomBetween(2000, 7000),
      type: "INCOME",
      category: i % 2 === 0 ? "Salary" : "Freelance",
      date: randomDate(sixMonthsAgo, now),
      description: i % 2 === 0 ? "Monthly salary" : "Freelance project",
      notes: null,
      tags: JSON.stringify(["income"]),
      createdById: analyst.id,
    });
  }

  // ── Viewer expense transactions ───────────────────────────────────────────
  for (let i = 0; i < 10; i++) {
    const category = expenseCategories[i % expenseCategories.length];
    const isSpike = i % 4 === 0;
    transactionData.push({
      amount: isSpike ? randomBetween(8000, 15000) : randomBetween(50, 300),
      type: "EXPENSE",
      category,
      date: randomDate(sixMonthsAgo, now),
      description: isSpike ? `Unusual ${category} spike` : `${category} expense`,
      notes: isSpike ? "Flagged as anomaly" : null,
      tags: JSON.stringify(isSpike ? ["spike", "anomaly"] : ["expense"]),
      createdById: viewer.id,
    });
  }
  // ── Viewer income transactions ────────────────────────────────────────────
  for (let i = 0; i < 5; i++) {
    transactionData.push({
      amount: randomBetween(1000, 4000),
      type: "INCOME",
      category: "Salary",
      date: randomDate(sixMonthsAgo, now),
      description: "Monthly salary",
      notes: null,
      tags: JSON.stringify(["income"]),
      createdById: viewer.id,
    });
  }

  await prisma.transaction.createMany({ data: transactionData });

  console.log(`✅ Created ${transactionData.length} transactions`);
  console.log("✅ Skipped audit logs (auto-generated on login)\n");

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🎉 Database seeded successfully!\n");
  console.log("📋 Test Credentials (all use Password@123):");
  console.log("  Admin   → admin@fintrack.io");
  console.log("  Analyst → analyst@fintrack.io");
  console.log("  Viewer  → viewer@fintrack.io");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
