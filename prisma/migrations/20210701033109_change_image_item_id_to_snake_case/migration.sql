/*
  Warnings:

  - You are about to drop the column `itemId` on the `Image` table. All the data in the column will be lost.
  - Added the required column `item_id` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "item_id" INTEGER NOT NULL,
    "link" TEXT NOT NULL,
    FOREIGN KEY ("item_id") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("id", "link") SELECT "id", "link" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
