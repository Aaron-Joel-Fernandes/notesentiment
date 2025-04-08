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
        { title, note },
        { headers: { token: `${token}` } }
      );
      setNotes([...notes, res.data]);
      setNote("");
      setTitle("");
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
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded mb-4"
        >
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
      <h2 className="text-xl font-semibold my-4">All Notes</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border border-gray-300 text-left">Title</th>
              <th className="p-2 border border-gray-300 text-left">Content</th>
              <th className="p-2 border border-gray-300 text-left">Actions</th>
              <th className="p-2 border border-gray-300 text-left">
                Sentiment
              </th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
              <tr key={note.id} className="hover:bg-gray-50">
                <td className="p-2 border border-gray-300">{note.title}</td>
                <td className="p-2 border border-gray-300">{note.note}</td>
                <td className="p-2 border border-gray-300">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs"
                    onClick={() => analyzeSentiment(note.id)}
                  >
                    Analyze
                  </button>
                </td>
                <td className="p-2 border border-gray-300">
                  {sentimentResult?.id === note.id ? (
                    <>
                      <span className="font-medium">
                        {sentimentResult.sentiment}
                      </span>{" "}
                      ({sentimentResult.score})
                    </>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Notes;
