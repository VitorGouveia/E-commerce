-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Address" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "postalCode" TEXT,
    "city" TEXT,
    "state" TEXT,
    "street" TEXT,
    "number" TEXT,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Address" ("id", "userId", "postalCode", "city", "state", "street", "number") SELECT "id", "userId", "postalCode", "city", "state", "street", "number" FROM "Address";
DROP TABLE "Address";
ALTER TABLE "new_Address" RENAME TO "Address";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "last_name" TEXT,
    "cpf" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_User" ("id", "created_at", "name", "last_name", "cpf", "email", "password") SELECT "id", "created_at", "name", "last_name", "cpf", "email", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
