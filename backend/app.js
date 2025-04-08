const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectToDatabase=require('./config/database');
const createAuthRoutes= require('./routes/authRoutes');
const createNoteRoutes=require('./routes/noteRoutes');
//Call set up js
const setUp= require('./config/setUp');


dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());

connectToDatabase().then((db) => {
    // Pass db to routes
    app.use('/api', createAuthRoutes(db));
    app.use('/api', createNoteRoutes(db));
  
    // Optional: expose db instance for testing
    app.locals.db = db;
  });

module.exports = app;