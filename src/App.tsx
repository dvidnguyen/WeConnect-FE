import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from "@/components/ui/button"
import { Route, Routes } from 'react-router-dom'
import Login from './auth/Login'
import SignUp from './auth/SignUp'
import HomePage from './pages/HomePage'
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path='*' element={<div>Error</div>} />
      </Routes>
    </>
  )
}

export default App
