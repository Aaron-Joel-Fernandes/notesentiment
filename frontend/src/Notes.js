// components/Notes.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";

const Notes = ({ token, onLogout }) => {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState("");
  const [title, setTitle] = useState("");
  const [sentimentResult, setSentimentResult] = useState(null);

  useEffect(() => {
    if (token) fetchNotes();
  }, [token]);

  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notes", {
        headers: { token },
      });
      setNotes(res.data);
    } catch (error) {
      console.error("Error fetching notes", error);
    }
  };

  const analyzeSentiment = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/${id}/analyze`, {
        headers: { token },
      });
      setSentimentResult({ id, ...res.data });
    } catch (err) {
      console.error("Analysis failed", err);
    }
  };

  const handleAddNote = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/notes",
        { title, note },
        { headers: { token } }
      );
      setNotes([...notes, res.data]);
      setNote("");
      setTitle("");
    } catch (error) {
      console.error("Error adding note", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header token={token} onLogout={onLogout} />
      <div className="notes-container">
        <h1 className="main-title">Create New Note</h1>
        <div className="note-form">
          <input
            className="note-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          /><br /><br />
          <textarea
            className="note-textarea"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note content..."
          ></textarea><br />
          <button onClick={handleAddNote} className="add-button">
            Add Note
          </button>
        </div>

        <h2 className="all-notes-title">All Notes</h2>
        <div className="notes-table-container">
          <table className="notes-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Content</th>
                <th>Actions</th>
                <th>Sentiment</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((note) => (
                <tr key={note.id}>
                  <td>{note.title}</td>
                  <td>{note.note}</td>
                  <td>
                    <button
                      className="analyze-btn"
                      onClick={() => analyzeSentiment(note.id)}
                    >
                      Analyze
                    </button>
                  </td>
                  <td>
                    {sentimentResult?.id === note.id
                      ? `${sentimentResult.sentiment} (${sentimentResult.score})`
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Notes;
