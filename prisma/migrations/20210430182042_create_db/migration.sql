-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Rating" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "itemId" TEXT NOT NULL,
    "one_star" TEXT,
    "two_star" TEXT,
    "three_star" TEXT,
    "four_star" TEXT,
    "five_star" TEXT,
    FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Rating" ("id", "itemId", "one_star", "two_star", "three_star", "four_star", "five_star") SELECT "id", "itemId", "one_star", "two_star", "three_star", "four_star", "five_star" FROM "Rating";
DROP TABLE "Rating";
ALTER TABLE "new_Rating" RENAME TO "Rating";
CREATE UNIQUE INDEX "Rating.itemId_unique" ON "Rating"("itemId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
