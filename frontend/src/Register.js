import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(username)) {
      newErrors.username = "Please enter a valid email address.";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    setMsg("");

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/register", {
        username,
        password,
      });
      setMsg("✅ Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setMsg(err.response?.data?.error || "❌ Registration failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded shadow-lg mt-10 bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-center">Create Account</h2>
      {msg && <p className="text-blue-600 mb-2 text-center">{msg}</p>}
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email Address"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`border p-2 w-full rounded ${
              errors.username ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`border p-2 w-full rounded ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full font-semibold transition-colors"
        >
          Register
        </button>

        <p className="text-sm text-center mt-2">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
