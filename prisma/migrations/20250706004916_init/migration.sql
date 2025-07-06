-- CreateTable
CREATE TABLE "UserIncome" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "month" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "income" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "advice" TEXT NOT NULL,
    "userIncomeId" INTEGER NOT NULL,
    CONSTRAINT "Recommendation_userIncomeId_fkey" FOREIGN KEY ("userIncomeId") REFERENCES "UserIncome" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
