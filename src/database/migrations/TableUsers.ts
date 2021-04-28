import { handle } from "@utils/ErrorHandler"

function CreateTableUsers(db) {
  const CreateTableUsersQuery = `
    CREATE TABLE IF NOT EXISTS users(
      uuid TEXT,
      created_at TEXT,
      name TEXT,
      email TEXT,
      password TEXT
    );
  `

  db.run(CreateTableUsersQuery, err => handle(err, "Failed at creating table users."))
}

function DropTableUsers(db) {
  db.run("DROP TABLE users;", err => handle(err, "Failed at dropping table users."))
}

export { CreateTableUsers, DropTableUsers }