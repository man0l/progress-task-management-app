import { useState, useEffect } from 'react';
import Layout from './Layout';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { HiUserCircle, HiPencil, HiTrash } from "react-icons/hi2";
import useTasks from '../hooks/useTasks';
import useUsers from '../hooks/useUsers';

const Tasks = () => {
  const [filters, setFilters] = useState({
    status: '',
    user: ''
  });
  const { state, isInitialized, logout, isTokenExpired } = useAuth();
  const navigate = useNavigate();
  const { tasks, isLoading, error, setError, updateTask } = useTasks(state, isInitialized, filters, logout, navigate);  
  const { users } = useUsers(state, isInitialized);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (!state.isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (isTokenExpired()) {
      setError("Your session has expired. Please log in again.");
      return;
    }
  }, [isInitialized, state.isAuthenticated, navigate, isTokenExpired]);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleResetFilters = () => {
    setFilters({
      status: '',
      user: ''
    });
  };
  
  const handleFilterSubmit = (e) => {
    e.preventDefault();
  };

  const handleTaskComplete = async (taskId, currentStatus) => {
    if (isTokenExpired()) {
      return;
    }
    
    try {
      await updateTask(taskId, { completed: !currentStatus });
    } catch (err) {
      console.error('Error updating task status:', err);
      setError(`Failed to update task status: ${err.message}`);
    }
  };
  
  if (!isInitialized) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-pulse text-gray-600">Loading...</div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Task List</h1>
          <Link to="/tasks/add" className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors">
              Add Task
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-lg font-semibold mb-3">Filters</h1>
          <form onSubmit={handleFilterSubmit} className="flex items-center gap-4 flex-wrap">
              <div className="flex flex-col">
                <label htmlFor="status" className="text-sm text-gray-600 mb-1">Status</label>
                <select 
                  className="border rounded p-2 w-48 bg-white" 
                  name="status" 
                  id="status" 
                  value={filters.status} 
                  onChange={handleFilterChange}
                >
                  <option value="">All</option>
                  <option value="true">Completed</option>
                  <option value="false">Pending</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="user" className="text-sm text-gray-600 mb-1">Assigned User</label>
                <select 
                  className="border rounded p-2 w-48 bg-white" 
                  name="user" 
                  id="user" 
                  value={filters.user} 
                  onChange={handleFilterChange}
                >
                  <option value="">All Users</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.email}</option>
                  ))}
                </select>
              </div>
              <div className="self-end">
                <button 
                  type="button" 
                  onClick={handleResetFilters}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded transition-colors"
                >
                  Reset Filters
                </button>
              </div>
          </form>
        </div>
      
        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-800">
            {error}
          </div>
        )}
      
        <div className="rounded">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-pulse text-gray-600">Loading tasks...</div>
            </div>
          ) : tasks.length > 0 ? (
            <div className="space-y-4 p-2">
              {tasks.map(task => (
                <div className="p-4 bg-white rounded shadow-sm hover:shadow-md transition-shadow" id={`task-${task.id}`} key={task.id}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={task.completed} 
                        onChange={() => handleTaskComplete(task.id, task.completed)}
                        className="w-5 h-5 rounded cursor-pointer" 
                        data-id={task.id}
                      />
                      <div className={`text-lg font-bold title ${task.completed ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">
                        {new Date(task.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <Link to={`/tasks/${task.id}/assign`} className="size-5 text-blue-500 hover:text-blue-700 transition-colors">
                        <HiUserCircle />
                      </Link>
                      <Link to={`/tasks/${task.id}/edit`} className="size-5 text-blue-500 hover:text-blue-700 transition-colors">
                        <HiPencil />
                      </Link>
                      <Link to={`/tasks/${task.id}/delete`} className="size-5 text-red-500 hover:text-red-700 transition-colors" data-trigger="delete-task" data-id={task.id}>
                        <HiTrash />
                      </Link>
                    </div>
                  </div>
                  <div className="text-sm font-normal text-gray-500 mt-2">{task.description}</div>
                  {task.completed ? (
                    <div className="mt-2 flex gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full status-badge">
                        Completed
                      </span>
                      {task.user && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Assigned to {task.user}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="mt-2 flex gap-2">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full status-badge">
                        Pending
                      </span>
                      {task.user && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          Assigned to {task.user}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 bg-gray-50 rounded text-center">
              <p className="text-gray-600 mb-3">No tasks found.</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleResetFilters}
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 py-2 px-4 rounded transition-colors"
                >
                  Clear Filters
                </button>
                <Link to="/tasks/add" className="bg-blue-500 text-white hover:bg-blue-600 py-2 px-4 rounded transition-colors">
                  Add New Task
                </Link>
              </div>
            </div>
          )}
        </div>    
      </div>
    </Layout>
  );
};

export default Tasks; 