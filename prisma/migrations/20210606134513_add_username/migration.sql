/*
  Warnings:

  - Made the column `postalCode` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `street` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `number` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `link` on table `Image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `discount` on table `Item` required. This step will fail if there are existing NULL values in that column.
  - Made the column `one_star` on table `Rating` required. This step will fail if there are existing NULL values in that column.
  - Made the column `two_star` on table `Rating` required. This step will fail if there are existing NULL values in that column.
  - Made the column `three_star` on table `Rating` required. This step will fail if there are existing NULL values in that column.
  - Made the column `four_star` on table `Rating` required. This step will fail if there are existing NULL values in that column.
  - Made the column `five_star` on table `Rating` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userhash` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `last_name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cpf` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Address" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Address" ("id", "userId", "postalCode", "city", "state", "street", "number") SELECT "id", "userId", "postalCode", "city", "state", "street", "number" FROM "Address";
DROP TABLE "Address";
ALTER TABLE "new_Address" RENAME TO "Address";
CREATE TABLE "new_Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "itemId" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("id", "itemId", "link") SELECT "id", "itemId", "link" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
CREATE TABLE "new_Item" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "itemId" TEXT NOT NULL,
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
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "userhash" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL
);
INSERT INTO "new_User" ("id", "created_at", "name", "last_name", "cpf", "email", "password") SELECT "id", "created_at", "name", "last_name", "cpf", "email", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
