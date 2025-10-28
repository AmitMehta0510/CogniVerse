import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ChatPage from "../pages/ChatPage";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import { useEffect, useState } from "react";

export default function AppRouter() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const location = useLocation();

  useEffect(() => {
    // whenever localStorage changes (login/register/logout), update token
    const syncToken = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", syncToken);
    return () => window.removeEventListener("storage", syncToken);
  }, []);

  useEffect(() => {
    // re-check token when route changes (like after registration)
    setToken(localStorage.getItem("token"));
  }, [location.pathname]);

  return (
    <Routes>
      <Route
        path="/"
        element={token ? <ChatPage /> : <Navigate to="/login" />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    </Routes>
  );
}
