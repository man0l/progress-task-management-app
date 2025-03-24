import { useState, useEffect } from 'react';
import Layout from '../common/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import useTasks from '../../hooks/useTasks';
import useUsers from '../../hooks/useUsers';
import Filters from './Filters';
import NoTasks from './NoTasks';
import Preloader from '../common/Preloader';
import TaskItem from './TaskItem';
import Modal from '../common/Modal';
import TaskForm from './TaskForm';

const Tasks = () => {
  const [filters, setFilters] = useState({
    status: '',
    user: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  
  const { state, isInitialized, logout, isTokenExpired } = useAuth();
  const navigate = useNavigate();
  const { tasks, isLoading, error, setError, updateTask, createTask } = useTasks(state, isInitialized, filters, logout, navigate);  
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
  
  const handleOpenModal = (task = null) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset selected task after modal closes
    setTimeout(() => {
      setSelectedTask(null);
    }, 300); // Small delay to allow the modal animation to complete
  };

  const handleTaskSubmit = async (taskData) => {
    if (isTokenExpired()) {
      setError("Your session has expired. Please log in again.");
      throw new Error("Session expired");
    }
    
    try {
      if (selectedTask) {
        // Update existing task
        await updateTask(selectedTask.id, taskData);
      } else {
        // Create new task
        await createTask(taskData);
      }
      
      // Close modal after successful submission
      handleCloseModal();
      
    } catch (err) {
      console.error('Error submitting task:', err);
      setError(`Failed to ${selectedTask ? 'update' : 'create'} task: ${err.message}`);
      throw err; // Re-throw to let the form component handle it
    }
  };
  
  if (!isInitialized) {
    return (
      <Preloader text="Loading tasks..." />
    );
  }
  
  return (
    <Layout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Task List</h1>
          <button 
            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors" 
            onClick={() => handleOpenModal()}
          >
            Add Task
          </button>
        </div>

        <Filters 
          filters={filters} 
          handleFilterChange={handleFilterChange} 
          handleResetFilters={handleResetFilters} 
          handleFilterSubmit={handleFilterSubmit} 
          users={users}
        />
      
        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-800">
            {error}
          </div>
        )}
      
        <div className="rounded">
          {isLoading ? (
            <Preloader text="Loading tasks..." />
          ) : tasks.length > 0 ? (
            <div className="space-y-4 p-2">
              {tasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  handleTaskComplete={handleTaskComplete}
                  onEdit={() => handleOpenModal(task)}
                />
              ))}
            </div>
          ) : (
            <NoTasks handleResetFilters={handleResetFilters} />
          )}
        </div>    
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <TaskForm 
          task={selectedTask} 
          onSubmit={handleTaskSubmit} 
        />
      </Modal>
    </Layout>
  );
};

export default Tasks; 