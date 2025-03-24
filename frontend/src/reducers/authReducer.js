export const initialState = {
    isAuthenticated: false,
    user: null,
    token: null
};
  

export const authReducer = (state, action) => {
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
  