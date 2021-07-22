/*
  Warnings:

  - You are about to alter the column `item_id` on the `Coupon` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Coupon" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "item_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "expire_date" INTEGER NOT NULL,
    FOREIGN KEY ("item_id") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Coupon" ("id", "item_id", "code", "expire_date") SELECT "id", "item_id", "code", "expire_date" FROM "Coupon";
DROP TABLE "Coupon";
ALTER TABLE "new_Coupon" RENAME TO "Coupon";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
