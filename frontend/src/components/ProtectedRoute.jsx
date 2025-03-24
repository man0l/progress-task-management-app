import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = () => {
  const { state } = useAuth();
  
  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute; 