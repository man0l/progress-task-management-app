import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { state, isInitialized } = useAuth();

  if (!isInitialized || !state.isAuthenticated) {
    return null;
  }

  return (
    <nav className="mx-4">
      <ul className="flex gap-4">
        <li>
          <Link to="/" className="text-gray-800 hover:text-blue-500 transition-colors">
            Home
          </Link>
        </li>
        <li>
          <Link to="/tasks" className="text-gray-800 hover:text-blue-500 transition-colors">
            Tasks
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;