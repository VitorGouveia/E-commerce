/*
  Warnings:

  - You are about to alter the column `itemId` on the `Image` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Item` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `itemId` on the `Rating` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "itemId" INTEGER NOT NULL,
    "link" TEXT NOT NULL,
    FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("id", "itemId", "link") SELECT "id", "itemId", "link" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
CREATE TABLE "new_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "shipping_price" TEXT NOT NULL,
    "discount" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "orders" TEXT NOT NULL
);
INSERT INTO "new_Item" ("id", "created_at", "name", "short_name", "description", "price", "shipping_price", "discount", "category", "orders") SELECT "id", "created_at", "name", "short_name", "description", "price", "shipping_price", "discount", "category", "orders" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
CREATE TABLE "new_Rating" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "itemId" INTEGER NOT NULL,
    "one_star" TEXT NOT NULL,
    "two_star" TEXT NOT NULL,
    "three_star" TEXT NOT NULL,
    "four_star" TEXT NOT NULL,
    "five_star" TEXT NOT NULL,
    FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Rating" ("id", "itemId", "one_star", "two_star", "three_star", "four_star", "five_star") SELECT "id", "itemId", "one_star", "two_star", "three_star", "four_star", "five_star" FROM "Rating";
DROP TABLE "Rating";
ALTER TABLE "new_Rating" RENAME TO "Rating";
CREATE UNIQUE INDEX "Rating.itemId_unique" ON "Rating"("itemId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
