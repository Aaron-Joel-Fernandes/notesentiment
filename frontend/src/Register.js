import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await axios.post("http://localhost:5000/api/register", {
        username,
        password,
      });
      setMsg("Registration successful! You can now login.");
      setTimeout(() => navigate("/"), 2000); // redirect after 2s
    } catch (err) {
      setMsg(err.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {msg && <p className="text-blue-500">{msg}</p>}
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full">
          Register
        </button>
        <p className="text-sm text-center mt-2">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600 underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
