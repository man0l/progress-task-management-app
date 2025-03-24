export const login = async (email, password) => {
  try {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || 'Login failed');
    }

    return { 
      success: true, 
      data: {
        access_token: data.access_token
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  return { success: true };
}; 