const initialState = {
    tasks: [],
    filter: 'all'
  };

const taskReducer = (state, action) => {
    switch (action.type) {
        case 'SET_TASKS':
            return { ...state, tasks: action.payload };
        case 'CREATE_TASK':
            return { ...state, tasks: [...state.tasks, action.payload] };
        case 'UPDATE_TASK':
            return { ...state, tasks: state.tasks.map(task => task.id === action.payload.id ? action.payload : task) };
        case 'DELETE_TASK':
            return { ...state, tasks: state.tasks.filter(task => task.id !== action.payload) };
        case 'ASSIGN_TASK':
            return { ...state, tasks: state.tasks.map(task => task.id === action.payload.id ? action.payload : task) };
        case 'FILTER_TASKS':
            return { ...state, filter: action.payload };
        default:
            return state;
        }
};

export { initialState, taskReducer };