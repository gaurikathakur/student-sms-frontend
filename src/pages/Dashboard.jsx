import React, { useEffect, useState } from "react";
import API from "../api";

const Dashboard = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    API.get("/admin/students")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("Error fetching students:", err));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">🎓 Student Dashboard</h1>
      {students.length === 0 ? (
        <p>No student data available yet.</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-purple-100">
              <th className="border p-2">Name</th>
              <th className="border p-2">Department</th>
              <th className="border p-2">Semester</th>
              <th className="border p-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td className="border p-2">{s.name}</td>
                <td className="border p-2">{s.department}</td>
                <td className="border p-2">{s.semester}</td>
                <td className="border p-2">{s.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
