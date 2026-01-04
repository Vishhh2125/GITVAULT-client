import { useState } from 'react'
import Home from './Components/Home.jsx'
import { Register } from './Components/Authentication/Register.jsx'
import { Login } from './Components/Authentication/SignIn.jsx'
import { Routes, Route } from 'react-router-dom'
import Layout from './Components/Layout/Layout.jsx'
import RepositoryPage from './Components/Repository/RepositoryPage.jsx'
import PatTokenPage from './Components/Token/patTokenPage.jsx'
import Settings from './Components/Settings/settings.jsx'
import ProtectedRoute from './Components/Authentication/ProtectedRoute.jsx'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes with Layout */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<div className="text-white">Dashboard Content</div>} />
        <Route path="/repositories" element={<ProtectedRoute><RepositoryPage /></ProtectedRoute>} />
        <Route path="/pat-tokens" element={<ProtectedRoute><PatTokenPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
  
      </Route>
    </Routes>
  )
}

export default App
