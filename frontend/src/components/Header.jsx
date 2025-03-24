import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Header = () => {
  const { state, logout, isInitialized } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  if (!isInitialized) {
    return (
      <div className="flex justify-between items-center p-4 bg-white shadow-md">
        <h1 className="text-xl font-semibold">Task Management</h1>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md">
      <h1 className="text-xl font-semibold">Task Management</h1>
      <Navbar />
      {state.isAuthenticated ? (
        <div className="flex items-center gap-4">
          <span className="text-sm">Welcome, {state.user?.name || state.user?.email || 'User'}</span>
          <button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      ) : (
        <button 
          onClick={handleLogin}
          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md transition-colors"
        >
          Login
        </button>
      )}
    </div>
  );
};

export default Header;