import { TOGGLE_MOST_ACTIVE_USER, UPDATE_SEARCH_MOST_ACTIVE_USERS_FILTER } from './../../resultsActions';

const mostActiveUsersReducer = (state = { filterTerm: '', usersToHide: [] }, action) => {
  switch (action.type) {
  case UPDATE_SEARCH_MOST_ACTIVE_USERS_FILTER:
    return { ...state, filterTerm: action.filterTerm };
  case TOGGLE_MOST_ACTIVE_USER:
    {
      const termIndex = state.usersToHide.indexOf(action.userId);
      if (termIndex > -1) {
        const newUsersToHide = [
          ...state.usersToHide.slice(0, termIndex),
          ...state.usersToHide.slice(termIndex + 1),
        ];

        return {
          ...state,
          usersToHide: newUsersToHide,
        };
      } else {
        return {
          ...state,
          usersToHide: [...state.usersToHide, action.userId],
        };
      }
    }

  default:
    return state;
  }
};

export default mostActiveUsersReducer;
