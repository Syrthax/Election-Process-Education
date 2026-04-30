import { createContext, useContext, useReducer } from 'react';

const AppContext = createContext(null);

const initialState = {
  userState: null, // 'not_registered', 'registered', 'ready_to_vote'
  selectedState: '',
  selectedConstituency: '',
  checklist: {},
  compareList: [],
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER_STATE':
      return { ...state, userState: action.payload };
    case 'SET_LOCATION':
      return { ...state, selectedState: action.payload.state, selectedConstituency: action.payload.constituency };
    case 'TOGGLE_CHECKLIST':
      return { ...state, checklist: { ...state.checklist, [action.payload]: !state.checklist[action.payload] } };
    case 'TOGGLE_COMPARE':
      return {
        ...state,
        compareList: state.compareList.includes(action.payload)
          ? state.compareList.filter(id => id !== action.payload)
          : state.compareList.length < 3
            ? [...state.compareList, action.payload]
            : state.compareList,
      };
    case 'CLEAR_COMPARE':
      return { ...state, compareList: [] };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
