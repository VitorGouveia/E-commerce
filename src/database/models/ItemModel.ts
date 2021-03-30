import { handle } from "../../utils/ErrorHandler"
import { db } from "../sqlite"

function Save(item) {
  const SaveItemQuery = `INSERT INTO items VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
  const Values = Object.values(item)

  db.all(SaveItemQuery, Values, err => handle(err, "Failed at storing item."))
}

function Index(callbackFunction) {
  const ListItemsQuery = `SELECT * FROM items;`

  db.all(ListItemsQuery, (err, rows) => {
    handle(err, "Failed at listing all items.")

    callbackFunction(rows)
  })
}

function FindByCategory(category, callbackFunction) {
  const FindItemByCategory = `SELECT * FROM items WHERE category=?;`

  db.all(FindItemByCategory, category, (err, rows) => {
    handle(err, "Failed at finding item by category.")

    callbackFunction(rows)
  })
}

function Update(item) {
  const UpdateItemQuery = `UPDATE item SET name=?, short_name=?, description=?, price=?, shipping_price=?, discount=?, category=?, image=?, orders=? WHERE uuid=?`

  db.all(UpdateItemQuery, item, err => handle(err, "Failed at updating user."))
}

function Delete(uuid) {
  const DeleteItemQuery = `DELETE FROM items WHERE uuid=?`

  db.all(DeleteItemQuery, uuid, err => handle(err, "Failed at deleting item."))
}

export { Save, Index, FindByCategory, Update, Delete }