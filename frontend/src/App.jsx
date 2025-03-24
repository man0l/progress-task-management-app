import Home from './components/Home'
import Login from './components/Login'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import { BrowserRouter, Routes, Route } from "react-router";
import './App.css'

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>          
          <Route path="/login" element={<Login />} />        
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />            
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
