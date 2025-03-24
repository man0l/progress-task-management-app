import React, { useState, useEffect } from 'react';
import useTasks from '../hooks/useTasks';
import { useAuth } from '../contexts/AuthContext';

const TaskManager = () => {
    const { tasks, filter, setFilter, createTask, updateTask, deleteTask, assignTask, filterTasks } = useTasks();
    const { user } = useAuth();
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        status: 'pending',
    });

    const handleInputChange = (e) => {
        setNewTask({ ...newTask, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <h1>Task Manager</h1>
        </div>
    )
    
}

export default TaskManager;