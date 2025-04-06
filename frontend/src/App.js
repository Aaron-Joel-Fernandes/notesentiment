import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Notes from "./Notes"; // Create Notes.js separately
import Register from "./Register";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/notes" /> : <Login setToken={setToken} />} />
        <Route path="/notes" element={token ? <Notes token={token} /> : <Navigate to="/" />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;
