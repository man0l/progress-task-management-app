import { useState } from 'react'
import Home from './components/Home'
import Login from './components/Login'
import { AuthProvider } from './contexts/AuthContext'

import { BrowserRouter, Routes, Route } from "react-router";
import './App.css'

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
