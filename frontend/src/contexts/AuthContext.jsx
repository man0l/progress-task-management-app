import { createContext, useReducer, useContext, useCallback, useMemo, useEffect, useState } from "react";

const getInitialState = () => {
  const savedState = localStorage.getItem('authState');
  if (savedState) {
    try {
      return JSON.parse(savedState);
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
    dispatch({
      type: 'LOGIN',
      payload: { user, token }
    });
  }, []);
    
  const logout = useCallback(() => {  
    localStorage.removeItem('authState');    
    dispatch({ type: 'LOGOUT' });
  }, []);
  
  const contextValue = useMemo(() => ({
    state,
    login,
    logout,
    isInitialized
  }), [state, login, logout, isInitialized]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
