const apiFetchUsers = async (token) => {
  const response = await fetch('http://localhost:5000/users', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return response;
};

export default apiFetchUsers;