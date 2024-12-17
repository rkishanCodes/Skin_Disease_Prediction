import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='w-48 h-[91vh] bg-blue-500'>
        <div className='flex items-center justify-between gap-2 flex-col'>
            <Link to="/dashboard">Check Disease</Link>
            <Link to="/dashboard/viewpescription">View Pescription</Link>
        </div>
    </div>
  )
}

export default Sidebar
