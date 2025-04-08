import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      navigate("/notes"); // Redirect to notes page
    } catch (err) {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleLogin} className="form-card">
      <h2>Sign</h2>
      {error && <p className="">{error}</p>}
      
      <label for="email">Email</label>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className=""
          required
        />
        <label for="password">Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className=""
          required
          minLength="6"
        />
        <button
          type="submit"
          className=""
        >
          Login
        </button>
      </form>
          <p className="form-footer">
          Don't have an account?{" "}
          <Link to="/register" className="">
           Sign up
          </Link>
        </p>
    </div>
  );
};

export default Login;
