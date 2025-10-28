import "./Auth.css";
import API from "../../utils/api.js";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ use login() from AuthContext
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
});

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", formData);

      const { token, user } = res.data;

      login(token, user); // ✅ updates AuthContext + localStorage
      toast.success("Registration successful!");
      navigate("/", { replace: true }); // ✅ redirect to home
    } catch (err) {
      console.error("Register Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Registration failed!");
    }
};

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
          />
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit">Register</button>
          <div className="auth-footer">
            <a href="/login">Already have an account? Login</a>
          </div>
        </form>
      </div>
    </div>
  );
}