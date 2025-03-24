import apiFetchUsers from '../services/userService';
import { useState, useEffect } from 'react';

const useUsers = (state, isInitialized) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {

    if (!isInitialized || !state.isAuthenticated) {
      return;
    }

    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiFetchUsers(state.token);
        const data = await response.json();
        setUsers(data.users || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [state, isInitialized]);

  return { users, isLoading, error };
};

export default useUsers;
