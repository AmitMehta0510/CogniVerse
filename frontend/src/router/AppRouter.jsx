import { Routes, Route, Navigate } from "react-router-dom";
import ChatPage from "../pages/ChatPage";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import { useAuth } from "../context/AuthContext";

export default function AppRouter() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route path="/" element={token ? <ChatPage /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    </Routes>
  );
}
