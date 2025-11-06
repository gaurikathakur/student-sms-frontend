// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  // role can be 'Admin' or 'Student' or undefined
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  if (!token || !userStr) return <Navigate to="/login" replace />;

  if (role) {
    try {
      const user = JSON.parse(userStr);
      if (user.role !== role) return <Navigate to="/login" replace />;
    } catch {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}
