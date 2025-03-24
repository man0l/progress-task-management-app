import { useState, useEffect, useReducer } from 'react';
import { apiFetchTasks, apiCreateTask, apiUpdateTask, apiDeleteTask, apiAssignTask } from '../services/taskService';
import { useAuth } from '../contexts/AuthContext';
import { taskReducer, initialState } from '../reducers/taskReducer';

const useTasks = () => {
    const [state, dispatch] = useReducer(taskReducer, initialState);
    const { state: authState } = useAuth();

    useEffect(() => {
        const fetchTasks = async () => {
            const tasksData = await apiFetchTasks(authState.token);
            dispatch({ type: 'SET_TASKS', payload: tasksData });
        };
        fetchTasks();
    }, [authState.token]);

    const createTask = async (task) => {
        const newTask = await apiCreateTask(task, authState.token);
        dispatch({ type: 'CREATE_TASK', payload: newTask });
    };

    const updateTask = async (taskId, task) => {
        const updatedTask = await apiUpdateTask(taskId, task, authState.token);
        dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
    };

    const deleteTask = async (taskId) => {
        await apiDeleteTask(taskId, authState.token);
        dispatch({ type: 'DELETE_TASK', payload: taskId });
    };

    const assignTask = async (taskId, userId) => {
        const assignedTask = await apiAssignTask(taskId, userId, authState.token);
        dispatch({ type: 'ASSIGN_TASK', payload: assignedTask });
    };

    const setFilter = (filterValue) => {
        dispatch({ type: 'FILTER_TASKS', payload: filterValue });
    };

    const filterTasks = (tasks, filter) => {
        return tasks.filter(task => {
            if (filter === 'all') return true;
            return task.completed === (filter === 'completed');
        });
    };

    return { 
        tasks: state.tasks, 
        filter: state.filter, 
        setFilter,
        createTask, 
        updateTask, 
        deleteTask, 
        assignTask, 
        filterTasks 
    };
};

export default useTasks;