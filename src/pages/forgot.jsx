// frontend/src/pages/Forgot.jsx
import React,{useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function Forgot(){ 
  const [username,setUsername]=useState(''); const [secretAnswer,setSecretAnswer]=useState(''); const [newPassword,setNewPassword]=useState(''); const navigate=useNavigate();
  const submit=async(e)=>{ e.preventDefault(); try{ await axios.post('http://localhost:5000/api/forgot-password',{ username, secretAnswer, newPassword }); alert('Password reset successful. Please login.'); navigate('/'); }catch(err){ alert(err.response?.data?.error || 'Reset failed'); } };
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-6 rounded shadow-md w-2/5'>
        <h2 className='text-xl font-semibold mb-4'>Reset Password</h2>
        <form onSubmit={submit} className='space-y-3'>
          <input placeholder='Username' value={username} onChange={e=>setUsername(e.target.value)} className='w-full p-3 border rounded' required/>
          <input placeholder='Secret Answer' value={secretAnswer} onChange={e=>setSecretAnswer(e.target.value)} className='w-full p-3 border rounded' required/>
          <input placeholder='New Password' type='password' value={newPassword} onChange={e=>setNewPassword(e.target.value)} className='w-full p-3 border rounded' required/>
          <button className='w-full bg-indigo-600 text-white p-3 rounded'>Reset Password</button>
        </form>
      </div>
    </div>
  );
}
