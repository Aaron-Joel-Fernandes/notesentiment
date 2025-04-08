const express = require('express');
const Sentiment = require('sentiment');
const authenticate = require('../middleware/authMiddleware');

const sentiment = new Sentiment();

/**
 * Factory function to create Note routes with injected db
 * @param {sqlite3.Database} db 
 */
function createNoteRoutes(db) {
  const router = express.Router();

  // Add Note with Sentiment Analysis
  router.post('/notes', authenticate, async (req, res) => {
    const { title, note } = req.body;

    if (!title || note.length < 10) {
      return res.status(400).json({
        error: 'Invalid input. Title cannot be empty, and content must be at least 10 characters long.'
      });
    }

    db.run(
      `INSERT INTO notes (user_id, title, note) VALUES (?, ?, ?)`,
      [req.user.id, title, note],
      function (err) {
        if (err) {
          console.error('DB Insert Error:', err.message);
          return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
          id: this.lastID,
          title,
          note
        });
      }
    );
  });

  // Get all Notes for user
  router.get('/notes', authenticate, (req, res) => {
    db.all(`SELECT * FROM notes WHERE user_id = ?`, [req.user.id], (err, rows) => {
      if (err) {
        console.error('DB Select Error:', err.message);
        return res.status(500).json({ error: err.message });
      }

      res.json(rows);
    });
  });

  // Sentiment analysis for specific note
  router.get('/:id/analyze', authenticate, (req, res) => {
    const noteId = req.params.id;

    db.get(
      `SELECT * FROM notes WHERE id = ? AND user_id = ?`,
      [noteId, req.user.id],
      (err, row) => {
        if (err) {
          console.error('DB Fetch Error:', err.message);
          return res.status(500).json({ error: 'Database error' });
        }

        if (!row) {
          return res.status(404).json({ error: 'Note not found' });
        }

        const analysis = sentiment.analyze(row.note);
        let sentimentLabel = 'neutral';
        if (analysis.score > 0) sentimentLabel = 'positive';
        else if (analysis.score < 0) sentimentLabel = 'negative';

        res.json({
          sentiment: sentimentLabel,
          score: analysis.score,
          note: row.note
        });
      }
    );
  });

  return router;
}

module.exports = createNoteRoutes;
