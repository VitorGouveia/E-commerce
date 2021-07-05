-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL,
    "admin" BOOLEAN DEFAULT false,
    "shadow_ban" BOOLEAN DEFAULT false,
    "ban" BOOLEAN DEFAULT false,
    "reason_for_ban" TEXT DEFAULT '',
    "ip" TEXT,
    "name" TEXT NOT NULL,
    "lastname" TEXT,
    "username" TEXT NOT NULL,
    "userhash" TEXT NOT NULL,
    "cpf" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_User" ("admin", "ban", "cpf", "created_at", "email", "id", "ip", "lastname", "name", "password", "reason_for_ban", "shadow_ban", "userhash", "username") SELECT "admin", "ban", "cpf", "created_at", "email", "id", "ip", "lastname", "name", "password", "reason_for_ban", "shadow_ban", "userhash", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
