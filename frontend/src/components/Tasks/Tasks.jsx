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
import AssignForm from './AssignForm';

const Tasks = () => {
  const [filters, setFilters] = useState({
    status: '',
    user: ''
  });

  const [modalState, setModalState] = useState({
    type: null,
    isOpen: false,
    task: null
  });
  
  const { state, isInitialized, logout, isTokenExpired } = useAuth();
  const navigate = useNavigate();
  const { 
          tasks, 
          isLoading, 
          error, 
          setError, 
          updateTask, 
          createTask, 
          deleteTask, 
          assignTask 
        } = useTasks(state, isInitialized, filters, logout, navigate);  
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
  
  const openModal = (type, task = null) => {
    setModalState({
      type,
      isOpen: true,
      task
    });
  };
  
  const closeModal = () => {
    setModalState(prev => ({
      ...prev,
      isOpen: false
    }));
        
    setTimeout(() => {
      setModalState(prev => ({
        ...prev,
        type: null,
        task: null
      }));
    }, 300);
  };

  const handleDeleteTask = async () => {
    if (isTokenExpired()) {
      return;
    }

    try {
      await deleteTask(modalState.task);
      closeModal();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleAssignTask = async (taskData) => {
    if (isTokenExpired()) {
      return;
    }

    try {
      const  newTask = {
        ...modalState.task,
        user_id: taskData.user_id
      }
      await assignTask(newTask);
      closeModal();
    } catch (err) {
      console.error('Error assigning task:', err);
    }
  };

  const handleTaskSubmit = async (taskData) => {
    if (isTokenExpired()) {
      setError("Your session has expired. Please log in again.");
      throw new Error("Session expired");
    }
    
    try {
      if (modalState.task) {        
        await updateTask(modalState.task.id, taskData);
      } else {
        await createTask(taskData);
      }

      closeModal();
      
    } catch (err) {
      console.error('Error submitting task:', err);
      setError(`Failed to ${modalState.task ? 'update' : 'create'} task: ${err.message}`);
      throw err;
    }
  };
  
  if (!isInitialized) {
    return (
      <Preloader text="Loading tasks..." />
    );
  }

  const renderModalContent = () => {
    switch (modalState.type) {
      case 'edit':
        return (
          <TaskForm 
            task={modalState.task} 
            onSubmit={handleTaskSubmit} 
          />
        );
      case 'delete':
        return (
          <div className="flex flex-col justify-center items-center gap-4">
            <div className="text-lg font-bold">
              Would you like to delete this task?
            </div>
            <div className="flex gap-4 justify-center items-start">
              <button className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition-colors" onClick={handleDeleteTask}>Delete</button>
              <button className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        );
      case 'assign':
        return (
          <AssignForm task={modalState.task} onSubmit={handleAssignTask} users={users} />
        );
      default:
        return null;
    }
  };
  
  return (
    <Layout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Task List</h1>
          <button 
            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors" 
            onClick={() => openModal('edit')}
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
                  showControls={true}
                  handleTaskComplete={handleTaskComplete}
                  onEdit={() => openModal('edit', task)}
                  onDelete={() => openModal('delete', task)}
                  onAssign={() => openModal('assign', task)}
                />
              ))}
            </div>
          ) : (
            <NoTasks handleResetFilters={handleResetFilters} />
          )}
        </div>    
      </div>
      
      <Modal 
        key={`task-modal-${modalState.task?.id}`} 
        isOpen={modalState.isOpen} 
        onClose={closeModal}
      >
        {renderModalContent()}
      </Modal>
    </Layout>
  );
};

export default Tasks; 