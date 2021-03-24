import { Database } from "sqlite3"
import { CreateTableUsers, DropTableUsers } from "./migrations/TableUsers"

const db = new Database("./src/database/app.db")

db.serialize(() => {
  CreateTableUsers(db)
})

export { db }