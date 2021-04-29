import { handle } from "@utils/ErrorHandler"
import { db } from "../sqlite"

function Save(item) {
  const SaveItemQuery = `INSERT INTO items VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
  const Values = Object.values(item)

  db.all(SaveItemQuery, Values, (err: Error) => handle(err, "Failed at storing item."))
}

function Index(callbackFunction: Function, numberOfItems: number) {
  const ListItemsQuery = `SELECT * FROM items LIMIT ?;`

  db.all(ListItemsQuery, numberOfItems, (err: Error, rows) => {
    handle(err, "Failed at listing all items.")

    callbackFunction(rows)
  })
}

function FindByCategory(category, callbackFunction) {
  const FindItemByCategory = `SELECT * FROM items WHERE category=?;`

  db.all(FindItemByCategory, category, (err: Error, rows) => {
    handle(err, "Failed at finding item by category.")

    callbackFunction(rows)
  })
}

function FindById(uuid, callbackFunction) {
  const FindItemById = `SELECT * FROM items WHERE uuid=?;`

  db.all(FindItemById, uuid, (err: Error, rows) => {
    handle(err, "Failed at finding item by uuid.")

    callbackFunction(rows[0])
  })
}

function UpdateRating(rating, uuid) {
  const UpdateRatingQuery = `UPDATE items SET rating=? WHERE uuid=?`

  db.all(UpdateRatingQuery, [rating, uuid], (err: Error) => handle(err, "Failed at updating rating."))
}

function Update(item) {
  const UpdateItemQuery = `UPDATE items SET name=?, short_name=?, description=?, price=?, shipping_price=?, discount=?, category=?, image=?, orders=?, rating=? WHERE uuid=?`

  db.all(UpdateItemQuery, item, (err: Error) => handle(err, "Failed at updating user."))
}

function Delete(uuid) {
  const DeleteItemQuery = `DELETE FROM items WHERE uuid=?`

  db.all(DeleteItemQuery, uuid, (err: Error) => handle(err, "Failed at deleting item."))
}

export { Save, Index, FindByCategory, FindById, UpdateRating, Update, Delete }