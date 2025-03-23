import { useState } from 'react'
import Home from './components/Home'
import { AuthProvider } from './contexts/AuthContext'

import { BrowserRouter, Routes, Route } from "react-router";
import './App.css'

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
