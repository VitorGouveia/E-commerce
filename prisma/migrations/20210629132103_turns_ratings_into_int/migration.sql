/*
  Warnings:

  - You are about to drop the column `orders` on the `Item` table. All the data in the column will be lost.
  - You are about to alter the column `one_star` on the `Rating` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `two_star` on the `Rating` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `three_star` on the `Rating` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `four_star` on the `Rating` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `five_star` on the `Rating` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "shipping_price" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL,
    "category" TEXT NOT NULL
);
INSERT INTO "new_Item" ("id", "created_at", "name", "short_name", "description", "price", "shipping_price", "discount", "category") SELECT "id", "created_at", "name", "short_name", "description", "price", "shipping_price", "discount", "category" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
CREATE TABLE "new_Rating" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "itemId" INTEGER NOT NULL,
    "one_star" INTEGER NOT NULL,
    "two_star" INTEGER NOT NULL,
    "three_star" INTEGER NOT NULL,
    "four_star" INTEGER NOT NULL,
    "five_star" INTEGER NOT NULL,
    FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Rating" ("id", "itemId", "one_star", "two_star", "three_star", "four_star", "five_star") SELECT "id", "itemId", "one_star", "two_star", "three_star", "four_star", "five_star" FROM "Rating";
DROP TABLE "Rating";
ALTER TABLE "new_Rating" RENAME TO "Rating";
CREATE UNIQUE INDEX "Rating.itemId_unique" ON "Rating"("itemId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
