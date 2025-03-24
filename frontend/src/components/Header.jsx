import { useAuth, logoutUser } from '../contexts/AuthContext';
import Navbar from './Navbar';
import { useNavigate } from 'react-router';
import { useCallback, memo } from 'react';

const Header = () => {
  const { state, dispatch } = useAuth();
  const navigate = useNavigate();

  const handleLogin = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const handleLogout = useCallback(() => {
    logoutUser(dispatch);
    navigate('/login');
  }, [dispatch, navigate]);

  return (
    <div className="flex justify-between items-center p-4">
      <h1>Task Management</h1>
      <Navbar />
      {state.isAuthenticated ? (
        <button 
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      ) : (
        <button 
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Login
        </button>
      )}
    </div>
  );
};

export default memo(Header);