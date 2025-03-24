import React, { memo } from 'react';
import Home from './components/Home'
import Login from './components/Login'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import TaskManager from './components/TaskManager'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css'

const App = memo(() => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>          
          <Route path="/login" element={<Login />} />        
          <Route path="/404-error" element={<div>404 Error</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/tasks" element={<TaskManager />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/404-error" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
});

export default App
