import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';
const Header = () => {

  return (
    <div className="flex justify-between items-center p-4">
      <h1>Task Management</h1>
      <Navbar />
      <button>Login</button>     
      
    </div>
  );
};

export default Header;