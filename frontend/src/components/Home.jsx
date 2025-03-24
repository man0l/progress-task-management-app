import Layout from './common/Layout';
import useTasks from '../hooks/useTasks';
import Preloader from './common/Preloader';
import NoTasks from './Tasks/NoTasks';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import TaskItem from './Tasks/TaskItem';

const Home = () => {
  const { state: authState, isInitialized } = useAuth();
  const [filters, setFilters] = useState({
    status: '',
    user: authState.user.id
  });
  
  const { tasks, isLoading, error, updateTask } = useTasks(authState, isInitialized, filters, setFilters);
  
  const handleResetFilters = () => {
    setFilters({
      status: '',
      user: authState.user.id
    });
  };

  const handleTaskComplete = async (taskId, currentStatus) => {
    try {
      await updateTask(taskId, { completed: !currentStatus });
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">My Tasks</h1>
          <div className="text-sm text-gray-500">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} assigned to you
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-800">
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Preloader text="Loading your tasks..." />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            {tasks.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {tasks.map((task) => (
                  <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <TaskItem task={task} handleTaskComplete={handleTaskComplete} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <NoTasks handleResetFilters={handleResetFilters} />
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Home;