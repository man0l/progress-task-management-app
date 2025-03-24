import Layout from './common/Layout';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { state, login, isInitialized } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isInitialized && state.isAuthenticated) {
      navigate('/');
    }
  }, [state.isAuthenticated, navigate, isInitialized]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.status === 200) {
        login(data.user, data.access_token);
        navigate('/');
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [email, password, login, navigate]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    if(name === 'email') {
      setEmail(value);
    } else if(name === 'password') {
      setPassword(value);
    }
  }, []);

  return (
    <Layout>
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-xl font-bold text-blue-500 p-4">Login</h1>
        <div className="w-full max-w-lg bg-gray-100 p-4 rounded-md">
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
            <form className="bg-white shadow-md p-4 rounded-md w-full" onSubmit={handleSubmit}>
                <div className="mb-4 mt-4">
                    <label htmlFor="email" className="mr-2 mb-2 block">Email</label>    
                    <input 
                      type="text" 
                      placeholder="Email" 
                      className="w-full py-2 px-3 shadow appearance-none leading-tight" 
                      onChange={handleInputChange} 
                      name="email" 
                      value={email}
                      disabled={isLoading} 
                    />
                </div>
                <div className="mb-4 mt-4">
                    <label htmlFor="password" className="mr-2 mb-2 block">Password</label>
                    <input 
                      type="password" 
                      placeholder="Password" 
                      className="w-full py-2 px-3 shadow appearance-none leading-tight" 
                      onChange={handleInputChange} 
                      name="password" 
                      value={password}
                      disabled={isLoading} 
                    />
                </div>
                <button 
                  type="submit" 
                  className={`bg-blue-500 text-white p-2 rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;