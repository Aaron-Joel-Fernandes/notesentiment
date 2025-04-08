const connectToDatabase = require("./database");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.sqlite");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
  );`);

  db.run(
    `
    CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  note TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
)`,
    (err) => {
      console.log(err);
      console.log("Tables created successfully.");
      db.close();
    }
  );
});