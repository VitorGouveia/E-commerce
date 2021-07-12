-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" INTEGER NOT NULL,
    "admin" BOOLEAN DEFAULT false,
    "shadow_ban" BOOLEAN DEFAULT false,
    "ban" BOOLEAN DEFAULT false,
    "reason_for_ban" TEXT DEFAULT '',
    "token_version" INTEGER NOT NULL DEFAULT 0,
    "failed_attemps" INTEGER NOT NULL DEFAULT 0,
    "confirmed" BOOLEAN DEFAULT false,
    "ip" TEXT,
    "name" TEXT NOT NULL,
    "lastname" TEXT,
    "username" TEXT NOT NULL,
    "userhash" TEXT NOT NULL,
    "cpf" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_User" ("id", "created_at", "admin", "shadow_ban", "ban", "reason_for_ban", "token_version", "failed_attemps", "confirmed", "ip", "name", "lastname", "username", "userhash", "cpf", "email", "password") SELECT "id", "created_at", "admin", "shadow_ban", "ban", "reason_for_ban", coalesce("token_version", 0) AS "token_version", coalesce("failed_attemps", 0) AS "failed_attemps", "confirmed", "ip", "name", "lastname", "username", "userhash", "cpf", "email", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
