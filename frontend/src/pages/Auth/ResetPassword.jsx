import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Auth.css";

const API = "/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch(`${API}/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");
      setMsg(data.message || "Password reset successful!");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setMsg(err.message || "Something went wrong.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset Password</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Reset Password</button>
          <div className="auth-footer">
            <a href="/login">Back to Login</a>
          </div>
        </form>
        {msg && <p className="info">{msg}</p>}
      </div>
    </div>
  );
}
