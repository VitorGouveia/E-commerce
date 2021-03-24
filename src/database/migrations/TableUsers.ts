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

  db.run(CreateTableUsersQuery, err => { 
    if(err) console.log(err)
  })
}

function DropTableUsers(db) {
  db.run("DROP TABLE users;", err => {
    if(err) console.log(err)
  })
}

export { CreateTableUsers, DropTableUsers }