import React from 'react'
import Navbar from '../../Components/Patient/Navbar'
import Sidebar from '../../Components/Patient/Sidebar'

const Dashboard = () => {
  return (
    <div className='w-full h-screen'>
        <Navbar/>
        <Sidebar/>
    </div>
  )
}

export default Dashboard
