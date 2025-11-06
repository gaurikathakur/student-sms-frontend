// 🧩 AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { getJSON, del, putJSON } from "../api.js";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [leaveRequests, setLeaveRequests] = useState([
    { name: "Aarav Sharma", date: "2025-11-02", teacher: "Dr. Neha Bansal", reason: "Promotion Approval", status: "Pending" },
  ]);
  const [noticeText, setNoticeText] = useState("");
  const nav = useNavigate();

  useEffect(() => { loadStudents(); }, []);

  async function loadStudents() {
    const res = await getJSON("/admin/students");
    if (res.error)
      Swal.fire({ icon: "error", title: "Error", text: res.error });
    else
      // add mock role check if not existing
      setStudents(res.map(s => ({ ...s, role: s.role || "Student" })));
  }

  async function promote(id) {
    const confirm = await Swal.fire({
      title: "Promote to Admin?",
      text: "This will send the promotion request for teacher approval.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Send Request",
    });
    if (!confirm.isConfirmed) return;

    setStudents(prev =>
      prev.map(s =>
        s.id === id ? { ...s, role: "PendingAdmin" } : s
      )
    );

    Swal.fire({
      icon: "info",
      title: "Awaiting Approval",
      text: "Promotion request sent to the teacher.",
    });
  }

  async function approvePromotion(name) {
    setStudents(prev =>
      prev.map(s =>
        s.name === name ? { ...s, role: "Admin" } : s
      )
    );
    setLeaveRequests(prev =>
      prev.map(r =>
        r.name === name ? { ...r, status: "Approved" } : r
      )
    );
    Swal.fire({
      icon: "success",
      title: `${name} is now an Admin!`,
      text: "Teacher approval granted.",
    });
  }

  async function delStudent(id) {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Delete Student?",
      text: "This record will be permanently deleted.",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      confirmButtonColor: "#d33",
    });
    if (!confirm.isConfirmed) return;
    const res = await del(`/admin/delete/${id}`);
    Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: res.message || "Student deleted successfully.",
    });
    loadStudents();
  }

  async function editStudent(student) {
    if (student.role === "PendingAdmin") {
      return Swal.fire({
        icon: "warning",
        title: "Approval Pending",
        text: "This user cannot edit details until teacher approval.",
      });
    }

    const { value: formValues } = await Swal.fire({
      title: `Edit ${student.name}`,
      html: `
        <input id="name" class="swal2-input" placeholder="Name" value="${student.name}">
        <input id="department" class="swal2-input" placeholder="Department" value="${student.department}">
        <input id="semester" type="number" class="swal2-input" placeholder="Semester" value="${student.semester}">
        <input id="cgpa" type="number" step="0.01" class="swal2-input" placeholder="CGPA" value="${student.cgpa || ""}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Save",
      preConfirm: () => ({
        name: document.getElementById("name").value,
        department: document.getElementById("department").value,
        semester: document.getElementById("semester").value,
        cgpa: document.getElementById("cgpa").value,
      }),
    });

    if (formValues) {
      const res = await putJSON(`/admin/update/${student.id}`, formValues);
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: res.message || `${student.name}'s details updated.`,
      });
      loadStudents();
    }
  }

  async function handleApprove(index) {
    const req = leaveRequests[index];
    if (req.reason === "Promotion Approval") {
      approvePromotion(req.name);
      return;
    }

    const confirm = await Swal.fire({
      icon: "question",
      title: "Approve Leave?",
      showCancelButton: true,
      confirmButtonText: "Approve",
    });
    if (!confirm.isConfirmed) return;
    const updated = [...leaveRequests];
    updated[index].status = "Approved";
    setLeaveRequests(updated);
    Swal.fire({ icon: "success", title: "Approved!", text: "Leave approved." });
  }

  async function handleReject(index) {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Reject Request?",
      showCancelButton: true,
      confirmButtonText: "Reject",
    });
    if (!confirm.isConfirmed) return;
    const updated = [...leaveRequests];
    updated[index].status = "Rejected";
    setLeaveRequests(updated);
    Swal.fire({ icon: "info", title: "Rejected", text: "Request rejected." });
  }

  async function handlePublish() {
    const adminApproved = students.some(
      s => s.role === "Admin" && s.name === "Aarav Sharma"
    );

    if (!adminApproved) {
      Swal.fire({
        icon: "warning",
        title: "Teacher Approval Required",
        text: "You cannot publish until teacher approves Aarav as Admin.",
      });
      return;
    }

    if (!noticeText.trim()) {
      Swal.fire({ icon: "warning", title: "Empty Notice", text: "Please enter a notice first!" });
      return;
    }
    const confirm = await Swal.fire({
      icon: "question",
      title: "Publish Notice?",
      showCancelButton: true,
      confirmButtonText: "Publish",
    });
    if (!confirm.isConfirmed) return;
    Swal.fire({ icon: "success", title: "Published!", text: "Notice published successfully." });
    setNoticeText("");
  }

  function logout() {
    Swal.fire({
      icon: "question",
      title: "Logout?",
      text: "Are you sure you want to logout?",
      showCancelButton: true,
      confirmButtonText: "Logout",
    }).then((r) => {
      if (r.isConfirmed) {
        localStorage.clear();
        nav("/login");
      }
    });
  }

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const avgCGPA =
    students.length > 0
      ? (students.reduce((a, b) => a + (b.cgpa || 0), 0) / students.length).toFixed(2)
      : 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header */}
      <header style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "15px 40px", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)",
      }}>
        <h2 style={{ color: "#4b2ae6", fontWeight: 700 }}>Admin Portal</h2>
        <input
          type="text"
          placeholder="🔍 Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px 14px", borderRadius: 8, border: "1px solid #ccc", width: 260,
          }}
        />
        <button
          onClick={logout}
          style={{
            background: "#dc3545", color: "white", border: "none",
            padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 600,
          }}
        >
          Logout
        </button>
      </header>

      {/* Main Dashboard */}
      <div
        style={{
          backdropFilter: "blur(12px)",
          background: "rgba(255, 255, 255, 0.9)",
          padding: "40px 50px",
          borderRadius: 16,
          boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
          width: "95%",
          maxWidth: "1100px",
          margin: "40px auto",
        }}
      >
        <h1 style={{ color: "#5c2ae6", fontWeight: 700 }}>🎓 Admin Dashboard</h1>
        <p style={{ color: "#555", marginBottom: 20 }}>
          Manage students, approve leaves, and publish announcements.
        </p>

        {/* Stat Cards */}
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          {[{ label: "Total Students", value: students.length, color: "#6c5ce7" },
            { label: "Avg CGPA", value: avgCGPA, color: "#00b894" },
            { label: "Pending Approvals", value: students.filter(s => s.role === "PendingAdmin").length, color: "#fdcb6e" },
          ].map((stat, i) => (
            <div key={i} style={{
              background: "white", borderRadius: 12, padding: 20,
              flex: "1 1 200px", textAlign: "center",
              boxShadow: "0 4px 15px rgba(0,0,0,0.08)", borderTop: `4px solid ${stat.color}`,
            }}>
              <h3 style={{ margin: 0, color: "#444" }}>{stat.label}</h3>
              <p style={{ margin: 0, fontSize: "1.8rem", color: stat.color, fontWeight: 700 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div style={{ background: "white", borderRadius: 12, padding: 16, marginTop: 40 }}>
          <h3 style={{ color: "#5c2ae6", textAlign: "center" }}>📊 Department-wise CGPA</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={[
              { dept: "CSE", avg: 8.2 },
              { dept: "IT", avg: 7.9 },
              { dept: "ECE", avg: 7.5 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="dept" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avg" fill="#6c5ce7" radius={[5, 5, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Student Table */}
        <div style={{ marginTop: 40 }}>
          <h3 style={{ color: "#5c2ae6" }}>👩‍🎓 Student List</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
            <thead style={{ background: "#ece8ff" }}>
              <tr>
                <th style={th}>ID</th>
                <th style={th}>Name</th>
                <th style={th}>Department</th>
                <th style={th}>Semester</th>
                <th style={th}>Role</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: "center", padding: 20 }}>No students found.</td></tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id}>
                    <td style={td}>{s.id}</td>
                    <td style={td}>{s.name}</td>
                    <td style={td}>{s.department}</td>
                    <td style={td}>{s.semester}</td>
                    <td style={td}>
                      {s.role === "PendingAdmin" ? "Pending Admin (Awaiting Teacher Approval)" : s.role}
                    </td>
                    <td style={td}>
                      <button style={btn("#5c2ae6")} onClick={() => nav(`/student/${s.id}`)}>View</button>
                      <button style={btn("#17a2b8")} onClick={() => editStudent(s)}>Edit</button>
                      <button style={btn("#28a745")} onClick={() => promote(s.id)}>Promote</button>
                      <button style={btn("#dc3545")} onClick={() => delStudent(s.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Leave Requests */}
        <div style={{ marginTop: 50 }}>
          <h3 style={{ color: "#5c2ae6" }}>📝 Pending Approvals</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f3f3f3" }}>
                <th style={th}>Name</th>
                <th style={th}>Date</th>
                <th style={th}>Teacher</th>
                <th style={th}>Reason</th>
                <th style={th}>Status</th>
                <th style={th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((req, i) => (
                <tr key={i}>
                  <td style={td}>{req.name}</td>
                  <td style={td}>{req.date}</td>
                  <td style={td}>{req.teacher}</td>
                  <td style={td}>{req.reason}</td>
                  <td style={{
                    ...td,
                    color: req.status === "Approved" ? "green" : req.status === "Rejected" ? "red" : "orange",
                    fontWeight: 600,
                  }}>{req.status}</td>
                  <td style={td}>
                    {req.status === "Pending" && (
                      <>
                        <button style={btn("#28a745")} onClick={() => handleApprove(i)}>Approve</button>
                        <button style={btn("#dc3545")} onClick={() => handleReject(i)}>Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Publish Notice */}
        <div style={{ marginTop: 40 }}>
          <h3>📢 Publish Notice</h3>
          <textarea
            placeholder="Type a new announcement..."
            value={noticeText}
            onChange={(e) => setNoticeText(e.target.value)}
            style={{
              width: "100%", height: 80, borderRadius: 8,
              padding: 10, border: "1px solid #ccc", marginBottom: 10,
            }}
          />
          <button style={btn("#5c2ae6")} onClick={handlePublish}>Publish</button>
        </div>
      </div>
    </div>
  );
}

const th = { padding: "12px 10px", textAlign: "left", fontWeight: 600, borderBottom: "2px solid #ddd" };
const td = { padding: "10px", borderBottom: "1px solid #eee" };
const btn = (bg) => ({
  background: bg,
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "6px 12px",
  margin: "0 4px",
  cursor: "pointer",
  fontWeight: 600,
});
