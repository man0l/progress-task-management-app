import { apiFetchTasks, apiUpdateTask, apiCreateTask, apiDeleteTask, apiAssignTask } from '../services/taskService';
import { useState, useEffect } from 'react';

const useTasks = (state, isInitialized, filters, logout, navigate) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {

    if (!isInitialized || !state.isAuthenticated) {
        return;
    }

    const fetchTasks = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const queryParams = new URLSearchParams();
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.user) queryParams.append('user', filters.user);
        
        const response = await apiFetchTasks(state.token, queryParams);
        
        if (response.status === 401) {
          setError("Your session has expired. Please log in again.");
          logout();
          navigate('/login');
          return;
        }
        
        if (!response.ok) {
          throw new Error(`Failed to fetch tasks: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        setTasks(data.tasks || []);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [state, isInitialized, filters, logout, navigate]);

  const updateTask = async (taskId, data) => {
    try {
      const existingTask = tasks.find(task => task.id === taskId);
      const updatedTask = { ...existingTask, ...data };
      const response = await apiUpdateTask(state.token, updatedTask);

      if (response.status === 401) {
        setError("Your session has expired. Please log in again.");
        logout();
        navigate('/login');
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Failed to update task: ${response.status} ${response.statusText}`);
      }

      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
    } catch (err) {
      console.error('Error updating task:', err);
      setError(`Failed to update task: ${err.message}`);
      throw err;
    }
  };

  const createTask = async (taskData) => {
    try {
      const response = await apiCreateTask(state.token, taskData);

      if (response.status === 401) {
        setError("Your session has expired. Please log in again.");
        logout();
        navigate('/login');
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Failed to create task: ${response.status} ${response.statusText}`);
      }

      const newTask = await response.json();
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      console.error('Error creating task:', err);
      setError(`Failed to create task: ${err.message}`);
      throw err;
    }
  };

  const deleteTask = async (task) => {
    try {
      const response = await apiDeleteTask(state.token, task);

      if (response.status === 401) {
        setError("Your session has expired. Please log in again.");
        logout();
        navigate('/login');
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Failed to delete task: ${response.status} ${response.statusText}`);
      }

      setTasks(prev => prev.filter(prevTask => prevTask.id !== task.id));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(`Failed to delete task: ${err.message}`);
      throw err;
    }
  };

  const assignTask = async (task) => {
    try {
      const response = await apiAssignTask(state.token, task);

      if (response.status === 401) {
        setError("Your session has expired. Please log in again.");
        logout();
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to assign task: ${response.status} ${response.statusText}`);
      }
      const newTask = await response.json();
      
      setTasks(prev => prev.map(prevTask => 
        prevTask.id === task.id ? newTask : prevTask
      ));

      return task;
    } catch (err) {
      console.error('Error assigning task:', err);
      setError(`Failed to assign task: ${err.message}`);
      throw err;
    }
  };

  return { tasks, setTasks, isLoading, error, setError, updateTask, createTask, deleteTask, assignTask };
};

export default useTasks;