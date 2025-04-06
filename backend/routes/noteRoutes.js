const express = require('express');
const db = require('../config/database');
const authenticate = require('../middleware/authMiddleware');
//const { analyzeSentimentLocal, analyzeSentimentGoogle } = require('../utils/sentimentAnalysis');
const Sentiment=require("sentiment");
const sentiment=new Sentiment();

const router = express.Router();

// Add Note with Sentiment Analysis
router.post('/notes', authenticate, async (req, res) => {
    const { title,note } = req.body;
    
    if (!title || note.length < 10) {
        return res.status(400).json({ error: 'Invalid input. Title cannot be empty, and content must be at least 10 characters long.' });
    }
    //const sentimentResult = await analyzeSentimentGoogle(note); // Use Google NLP
     //const sentimentResult = analyzeSentimentLocal(note); // Use local analysis

    db.run(`INSERT INTO notes (user_id,title, note) VALUES (?,?,?)`, [req.user.id, title,note], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ title: title,note: note, id: this.lastID });
    });
});

// Get User Notes
router.get('/notes', authenticate, (req, res) => {
    
    db.all(`SELECT * FROM notes WHERE user_id = ?`, [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
   
});

router.get('/:id/analyze', authenticate ,(req, res) => {
    const noteId = req.params.id;
    db.get(
        `SELECT * FROM notes WHERE id = ? AND user_id = ?`,
        [noteId, req.user.id],
        (err, row) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
              }
        
              if (!row) {
                return res.status(404).json({ error: 'Note not found' });
              }
        
              const analysis = sentiment.analyze(row.note); // assuming `note` is the content field
              let sentimentLabel = 'neutral';
              if (analysis.score > 0) sentimentLabel = 'positive';
              else if (analysis.score < 0) sentimentLabel = 'negative';
        
              res.json({ sentiment: sentimentLabel, score: analysis.score });
        });
});
module.exports = router;
