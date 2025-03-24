import { createContext, useReducer, useContext, useEffect, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { authReducer, initialState } from "../reducers/authReducer";



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