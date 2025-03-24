const apiFetchTasks = async (token, queryParams) => {
  const response = await fetch(`http://localhost:5000/tasks?${queryParams.toString()}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.status} ${response.statusText}`);
  }

  return response;
};

const apiUpdateTask = async (token, task) => {
  const response = await fetch(`http://localhost:5000/tasks/${task.id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  });

  return response;
};

export { apiFetchTasks, apiUpdateTask };