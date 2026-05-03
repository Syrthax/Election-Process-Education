// Pure state-management for the AppContext. Kept in its own module so it
// can be unit-tested in isolation and so AppContext.jsx can satisfy
// react-refresh/only-export-components.

export const initialState = {
  userState: null,
  selectedState: '',
  selectedConstituency: '',
  checklist: {},
  compareList: [],
};

export const ACTIONS = Object.freeze({
  SET_USER_STATE: 'SET_USER_STATE',
  SET_LOCATION: 'SET_LOCATION',
  TOGGLE_CHECKLIST: 'TOGGLE_CHECKLIST',
  TOGGLE_COMPARE: 'TOGGLE_COMPARE',
  CLEAR_COMPARE: 'CLEAR_COMPARE',
});

export const MAX_COMPARE = 3;

export function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_USER_STATE:
      return { ...state, userState: action.payload };

    case ACTIONS.SET_LOCATION:
      return {
        ...state,
        selectedState: action.payload.state,
        selectedConstituency: action.payload.constituency,
      };

    case ACTIONS.TOGGLE_CHECKLIST:
      return {
        ...state,
        checklist: { ...state.checklist, [action.payload]: !state.checklist[action.payload] },
      };

    case ACTIONS.TOGGLE_COMPARE: {
      const list = state.compareList;
      if (list.includes(action.payload)) {
        return { ...state, compareList: list.filter(id => id !== action.payload) };
      }
      if (list.length >= MAX_COMPARE) return state;
      return { ...state, compareList: [...list, action.payload] };
    }

    case ACTIONS.CLEAR_COMPARE:
      return { ...state, compareList: [] };

    default:
      return state;
  }
}
