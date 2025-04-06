const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to SQLite database.');
});

// Create tables
db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)`);
db.run(`CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, title TEXT, user_id INTEGER, note TEXT)`);
//db.run(`DELETE FROM notes where note=null`);

module.exports = db;