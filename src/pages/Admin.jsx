// frontend/src/pages/Admin.jsx
import React,{useEffect,useState} from 'react';
import axios from 'axios';
export default function Admin(){
  const [students,setStudents]=useState([]);
  useEffect(()=>{
    const token=localStorage.getItem('token');
    if(!token) return;
    axios.get('http://localhost:5000/api/students',{ headers:{ Authorization:`Bearer ${token}` } }).then(res=> setStudents(res.data.students || [])).catch(e=> console.error(e));
  },[]);
  return (
    <div className='p-6'>
      <h1 className='text-2xl font-semibold mb-4'>Admin Dashboard</h1>
      <div className='bg-white rounded shadow p-4'>
        <h3 className='font-medium mb-2'>Students</h3>
        <table className='w-full text-left'>
          <thead><tr><th>ID</th><th>Name</th><th>Username</th><th>Dept</th><th>Sem</th></tr></thead>
          <tbody>
            {students.map(s=> <tr key={s.Id}><td>{s.Id}</td><td>{s.Name}</td><td>{s.Username}</td><td>{s.DepartmentName}</td><td>{s.Semester}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
