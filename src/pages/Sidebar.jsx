// src/components/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar({ user }) {
  const isAdmin = user?.Role === "Admin" || user?.role === "Admin";
  return (
    <aside className="sidebar">
      <div className="brand">Student Portal</div>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/attendance">Attendance</Link>
        <Link to="/library">Library</Link>
        <Link to="/seminars">Seminars</Link>
        <Link to="/lms">LMS</Link>
        <Link to="/faculty">Faculty</Link>
        {isAdmin && (
          <>
            <Link to="/admin/students">Manage Students</Link>
            <Link to="/admin/settings">Settings</Link>
          </>
        )}
      </nav>
    </aside>
  );
}
