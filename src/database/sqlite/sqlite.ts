import { Database } from "sqlite3"
import { CreateTableUsers, DropTableUsers } from "./migrations/TableUsers"
import { CreateTableItems, DropTableItems } from "./migrations/TableItems"

const db = new Database("./src/database/app.db")

db.serialize(() => {
  CreateTableUsers(db)
  CreateTableItems(db)
})

export { db }