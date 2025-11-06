// frontend/src/pages/Student.jsx
import React,{useEffect,useState} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
export default function Student(){
  const { id } = useParams();
  const [student,setStudent]=useState(null);
  useEffect(()=>{
    const token=localStorage.getItem('token');
    if(!token) return;
    axios.get(`http://localhost:5000/api/student/${id}`,{ headers:{ Authorization:`Bearer ${token}` } }).then(res=> setStudent(res.data.student)).catch(e=> console.error(e));
  },[id]);
  if(!student) return <div className='p-8'>Loading...</div>;
  return (
    <div className='p-8'>
      <h1 className='text-2xl font-semibold mb-4'>Welcome, {student.Name}</h1>
      <div className='grid grid-cols-2 gap-6'>
        <div className='p-4 bg-white rounded shadow'>
          <h3 className='font-medium'>Profile</h3>
          <p><strong>Department:</strong> {student.DepartmentName}</p>
          <p><strong>Semester:</strong> {student.Semester}</p>
          <p><strong>Hometown:</strong> {student.Hometown}</p>
        </div>
        <div className='p-4 bg-white rounded shadow'>
          <h3 className='font-medium'>Performance</h3>
          <p>CGPA: {student.CGPA}</p>
        </div>
      </div>
    </div>
  );
}
