import React, { useState, useEffect } from "react";
import axios from "axios";

const Notes = ({ token }) => {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState("");
  const [title, setTitle] = useState("");
  const [sentimentResult, setSentimentResult] = useState(null);
  useEffect(() => {
    fetchNotes();
  }, []);

  const analyzeSentiment = async (id) => {
    const res = await axios.get(`http://localhost:5000/api/${id}/analyze`, {
      headers: { token: `${token}` },
    });
    setSentimentResult({ id, ...res.data });
  };


  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notes", {
        headers: { token: `${token}` },
      });
      setNotes(res.data);
    } catch (error) {
      console.error("Error fetching notes", error);
    }
  };

  const handleAddNote = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/notes",
        { title,note },
        { headers: { token: `${token}` } }
      );
      setNotes([...notes, res.data]);
      setNote("");
      setTitle("")
    } catch (error) {
      console.error("Error adding note", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; // Force redirect to login
  };

  return (
    <div className="container">
      <h1 className="title">Sentiment Analysis Notes</h1>
      <div className="form">
      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded mb-4">
        Logout
      </button>
      <input
        className="input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        className="textarea"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Content"
      ></textarea>
      <button onClick={handleAddNote} className="button">
        Add Note
      </button>
      </div>
      <h2 className="subtitle">All Notes</h2>
      {notes.map((note) => (
        <div key={note.id} className="note">
          <h3 className="note-title">{note.title}</h3>
          <p className="note-content">{note.note}</p>
          <button className="analyze-button" onClick={() => analyzeSentiment(note.id)}>
            Analyze Sentiment
          </button>
          {sentimentResult?.id === note.id && (
            <div className="sentiment-result">
              <p>Sentiment: <strong>{sentimentResult.sentiment}</strong> (score: {sentimentResult.score})</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Notes;
