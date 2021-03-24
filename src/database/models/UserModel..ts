import { handle } from "../../utils/ErrorHandler"
import { db } from "../sqlite"

function Save(user) {
  const SaveUserQuery = `INSERT INTO users(uuid, created_at, name, email, password) VALUES (?, ?, ?, ?, ?);`
  const Values = Object.values(user)

  db.all(SaveUserQuery, Values, err => handle(err, "Failed at storing user."))
}

export { Save }