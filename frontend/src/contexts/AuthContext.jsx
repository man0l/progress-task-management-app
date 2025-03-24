import { createContext, useReducer, useContext, useEffect, useMemo, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token
      };
    case "LOGOUT":
      return initialState;
    default:
      return state;
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const user = { 
            id: decodedToken.sub,
            roles: decodedToken.roles || []
          };
          
          dispatch({
            type: 'LOGIN',
            payload: {
              user,
              token
            }
          });
        } catch (error) {
          console.error('Token validation error:', error);
          localStorage.removeItem('token');
        }
      }
    };
    
    checkLoggedIn();
  }, []);
  const contextValue = useMemo(() => ({
    state,
    dispatch
  }), [state]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const loginUser = async (dispatch, email, password) => {
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

    const decodedToken = jwtDecode(data.access_token);
    const user = {
      id: decodedToken.sub,
      roles: decodedToken.roles || []
    };

    localStorage.setItem('token', data.access_token);
    
    dispatch({
      type: 'LOGIN',
      payload: {
        user,
        token: data.access_token
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
};

export const logoutUser = (dispatch) => {
  localStorage.removeItem('token');
  dispatch({ type: 'LOGOUT' });
  return { success: true };
};
