import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import API from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ clear old data before login
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      const res = await API.post("/auth/login", { email, password });

      // ✅ save new session
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success(res.data.message || "Login successful!");
      navigate("/"); // redirect to home/chatpage
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          <div className="auth-footer">
            <a href="/forgot-password">Forgot Password?</a>
          </div>
        </form>
        {msg && <p className="info">{msg}</p>}
      </div>
    </div>
  );
}
