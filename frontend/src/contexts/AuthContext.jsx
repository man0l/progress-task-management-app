import { createContext, useReducer, useContext, useCallback, useMemo, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);    
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return true;
  }
};

const getInitialState = () => {
  const savedState = localStorage.getItem('authState');
  if (savedState) {
    try {
      const parsedState = JSON.parse(savedState);
      
      if (parsedState.token && isTokenExpired(parsedState.token)) {
        console.log('Stored token is expired, clearing auth state');
        localStorage.removeItem('authState');
        return {
          isAuthenticated: false,
          user: null,
          token: null
        };
      }
      
      return parsedState;
    } catch (e) {
      console.error('Failed to parse auth state from localStorage', e);
    }
  }
  return {
    isAuthenticated: false,
    user: null,
    token: null
  };
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
      return {
        isAuthenticated: false,
        user: null,
        token: null
      };
    default:
      return state;
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, getInitialState());
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {  
    setIsInitialized(true);
  }, []);
  
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('authState', JSON.stringify(state));
    }
  }, [state, isInitialized]);
  

  
  const login = useCallback((user, token) => {
    if (!token || isTokenExpired(token)) {
      console.error('Attempted to login with an expired or invalid token');
      return false;
    }
    
    dispatch({
      type: 'LOGIN',
      payload: { user, token }
    });
    
    return true;
  }, []);
    
  const logout = useCallback(() => {  
    localStorage.removeItem('authState');    
    dispatch({ type: 'LOGOUT' });
  }, []);

  useEffect(() => {
    if (state.token && state.isAuthenticated && isTokenExpired(state.token)) {
      console.log('Token is expired, logging out');
      logout();
    }
  }, [state.token, state.isAuthenticated, logout]);
  
  const checkTokenExpiration = useCallback(() => {
    if (state.token && isTokenExpired(state.token)) {
      console.log('Token expired during check');
      logout();
      return true;
    }
    return false;
  }, [state.token, logout]);
  
  const contextValue = useMemo(() => ({
    state,
    login,
    logout,
    isInitialized,
    isTokenExpired: checkTokenExpiration
  }), [state, login, logout, isInitialized, checkTokenExpiration]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
