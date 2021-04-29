import { handle } from "@utils/ErrorHandler"
import { db } from "../sqlite"

function Save(user) {
  const SaveUserQuery = `INSERT INTO users(uuid, created_at, name, email, password) VALUES (?, ?, ?, ?, ?);`
  const Values = Object.values(user)

  db.all(SaveUserQuery, Values, (err: Error) => handle(err, "Failed at storing user."))
}

function Index(callbackFunction) {
  const ListUsersQuery = `SELECT * FROM users;`

  db.all(ListUsersQuery, (err: Error, rows) => {
    handle(err, "Failed at listing all users.")

    callbackFunction(rows)
  })
}

function FindByEmail(email, callbackFunction) {
  const FindUserByEmailQuery = `SELECT * FROM users WHERE email=?;`

  db.all(FindUserByEmailQuery, email, (err: Error, rows) => {
    handle(err, "Failed at finding user by email.")

    callbackFunction(rows)
  })
}

function Update(userNewInformation) {
  const UpdateUserQuery = `UPDATE users SET name=?, email=?, password=? WHERE uuid=?`

  db.all(UpdateUserQuery, userNewInformation, (err: Error) => handle(err, "Failed at updating user."))
}

function Delete(user) {
  const DeleteUserQuery = `DELETE FROM users WHERE uuid=?`

  db.all(DeleteUserQuery, user, (err: Error) => handle(err, "Failed at deleting user."))
}

export { Save, Index, FindByEmail, Update, Delete }