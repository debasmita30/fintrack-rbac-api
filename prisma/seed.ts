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

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.user.deleteMany();

  // ── Create Users ──────────────────────────────────────────────────────────
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

  const inactiveUser = await prisma.user.create({
    data: {
      email: "inactive@fintrack.io",
      name: "Dave (Inactive)",
      password: hashedPassword,
      role: "VIEWER",
      status: "INACTIVE",
    },
  });

  console.log("✅ Created 4 users");

  // ── Create Transactions ───────────────────────────────────────────────────
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

  const transactionData = [];

  // Income transactions
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

  // Expense transactions
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

  for (let i = 0; i < 60; i++) {
    const category = expenseCategories[i % expenseCategories.length];
    transactionData.push({
      amount: randomBetween(50, 1500),
      type: "EXPENSE",
      category,
      date: randomDate(sixMonthsAgo, now),
      description: `${category} expense`,
      notes: null,
      tags: JSON.stringify(["expense", category.toLowerCase()]),
      createdById: admin.id,
    });
  }

  // A few soft-deleted transactions
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

  await prisma.transaction.createMany({ data: transactionData });

  console.log(`✅ Created ${transactionData.length} transactions`);

  // ── Seed Audit Logs ───────────────────────────────────────────────────────
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
