const sqlite3 = require('sqlite3').verbose();

function connectToDatabase(dbPath = './database.sqlite') {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Failed to connect to SQLite:', err.message);
        return reject(err);
      }
      console.log('Connected to SQLite database.');
      resolve(db);
    });
  });
}

module.exports = connectToDatabase;
// Create tables
//db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)`);
//db.run(`CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, title TEXT, user_id INTEGER, note TEXT)`);
//db.run(`DELETE FROM notes where note=null`);

//module.exports = db;