import React from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const doctor_name = localStorage.getItem('doctor_name')
    const navigate = useNavigate()
    const handlelogout = () => {
        localStorage.removeItem('doctor_token')
        localStorage.removeItem('doctor_name')
        localStorage.removeItem('doctor_id')
        navigate("/doctor/login");
    }
  return (
    <div className='flex justify-between p-2 text-[#fb6b68] bg-white'>
      <h1 className="text-xl">hello! doctor {doctor_name} ready to cure</h1>
      <div>
        <button className='p-2 rounded-md bg-red-500 text-white' onClick={handlelogout}>Logout</button>
      </div>
    </div>
  )
}

export default Navbar
