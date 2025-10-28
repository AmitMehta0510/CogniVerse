import React, { useState } from "react";
import "./Auth.css";

const API = "/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMsg(data.message || "Check your email for reset instructions.");
    } catch (err) {
      setMsg("Something went wrong.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Forgot Password</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input type="email" placeholder="Registered email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button type="submit">Send Reset Link</button>
          <div className="auth-footer">
            <a href="/login">Back to Login</a>
          </div>
        </form>
        {msg && <p className="info">{msg}</p>}
      </div>
    </div>
  );
}
