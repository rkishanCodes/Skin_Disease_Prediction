import React from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const username = localStorage.getItem('patient_name')
    const navigate = useNavigate()
    const handlelogout = () =>{
        localStorage.removeItem('patient_token')
        localStorage.removeItem('patient_name')
        navigate("/")
    }
  return (
    <div className='w-full bg-blue-500 flex justify-between px-4 py-2'>
        <div className='text-xl font-bold'>Patient_portal</div>
        <div className='flex gap-2 items-center justify-center'>
            <h1 className='text-xl'>hello! {username}</h1>
            <button onClick={handlelogout} className='bg-red-500 rounded-md px-3 py-2'>Logout</button>
        </div>
    </div>
  )
}

export default Navbar
