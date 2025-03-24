import Layout from './Layout';
import { useState, useEffect } from 'react';
import { useAuth, loginUser } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { state, dispatch } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (state.isAuthenticated) {
      navigate('/');
    }
  }, [state.isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await loginUser(dispatch, email, password);
      if (!result.success) {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if(name === 'email') {
      setEmail(value);
    } else if(name === 'password') {
      setPassword(value);
    }
  }

  return (
    <Layout>
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-xl font-bold text-blue-500 p-4">Login</h1>
        <div className="w-full max-w-lg bg-gray-100 p-4 rounded-md">
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
            <form className="bg-white shadow-md p-4 rounded-md w-full" onSubmit={handleSubmit}>
                <div className="mb-4 mt-4">
                    <label htmlFor="email" className="mr-2 mb-2 block">Email</label>    
                    <input type="text" placeholder="Email" className="w-full py-2 px-3 shadow appearance-none leading-tight" onChange={handleInputChange} name="email" value={email} disabled={loading} />
                </div>
                <div className="mb-4 mt-4">
                    <label htmlFor="password" className="mr-2 mb-2 block">Password</label>
                    <input type="password" placeholder="Password" className="w-full py-2 px-3 shadow appearance-none leading-tight" onChange={handleInputChange} name="password" value={password} disabled={loading} />
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded-md" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;