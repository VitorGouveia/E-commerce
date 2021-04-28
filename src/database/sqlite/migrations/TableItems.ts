import { handle } from "@utils/ErrorHandler"

function CreateTableItems(db) {
  const CreateTableItemsQuery = `
    CREATE TABLE IF NOT EXISTS items(
      uuid TEXT,
      created_at TEXT,
      name TEXT,
      short_name TEXT,
      description TEXT,
      price TEXT,
      shipping_price TEXT,
      discount TEXT,
      category TEXT,
      image TEXT,
      orders TEXT,
      rating TEXT
    );
  `

  db.run(CreateTableItemsQuery, err => handle(err, "Failed at creating table users."))
}

function DropTableItems(db) {
  db.run("DROP TABLE items;", err => handle(err, "Failed at dropping table items."))
}

export { CreateTableItems, DropTableItems }