-- CreateTable
CREATE TABLE "Coupon" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "item_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expire_date" INTEGER NOT NULL
);
