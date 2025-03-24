const API_URL = 'http://localhost:5000';

const getHeaders = (token) => {    
    return {
        'Authorization': `Bearer ${token}`
    };
};

export const apiFetchTasks = async (token) => {
    const response = await fetch(`${API_URL}/tasks`, { headers: getHeaders(token) });
    const data = await response.json();
    return data;
};

export const apiGetTask = async (taskId, token) => {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, { headers: getHeaders(token) });
    const data = await response.json();
    return data;
};

export const apiCreateTask = async (task, token) => {
    const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        body: JSON.stringify(task),
        headers: getHeaders(token)
    });
};

export const apiUpdateTask = async (taskId, task, token) => {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(task),
        headers: getHeaders(token)
    });
};

export const apiDeleteTask = async (taskId, token) => {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: getHeaders(token)
    });
};

export const apiAssignTask = async (taskId, userId, token) => {
    const response = await fetch(`${API_URL}/tasks/${taskId}/assign`, {
        method: 'POST',
        body: JSON.stringify({ userId }),
        headers: getHeaders(token)
    });
};