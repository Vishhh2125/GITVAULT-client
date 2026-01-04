import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className="h-screen bg-gradient-to-b from-[#0e1018] to-[#0b0d14] flex flex-col">
      {/* Navbar - Fixed height */}
      <Navbar />
      
      {/* Main content area - Takes remaining height */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout