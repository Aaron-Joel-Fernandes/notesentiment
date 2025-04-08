const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Factory function to create auth routes using a provided SQLite db instance
 * @param {sqlite3.Database} db
 */
function createAuthRoutes(db) {
  const router = express.Router();

  // Register User
  router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }
      db.run(
        `INSERT INTO users (username, password) VALUES (?, ?)`,
        [username, hashedPassword],
        function (err) {
           console.log(err) 
          if (err) {
            if (err.message.includes("UNIQUE constraint failed")) {
                return res.status(400).json({ error: "Username already exists" });
            }
            console.error(err.message);
            return res.status(500).json({ error: "Registration failed" });
          }
          res.status(201).json({ message: "User registered successfully" });
        }
      );
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  });

  // Login User
  router.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.get(
      `SELECT * FROM users WHERE username = ?`,
      [username],
      async (err, user) => {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ error: "Login failed" });
        }
        if (!user) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        try {
          const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );
          res.json({ token });
        } catch (error) {
          res.status(500).json({ error: "Token generation failed" });
        }
      }
    );
  });

  return router;
}

module.exports = createAuthRoutes;
