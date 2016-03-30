import { combineReducers } from 'redux';
import {
  UPDATE_MOST_USED_WORDS_SEARCH_FILTER, TOGGLE_MOST_USED_WORD,
  UPDATE_MOST_ACTIVE_USERS_SEARCH_FILTER, TOGGLE_MOST_ACTIVE_USER
} from './mostFrequentActions';

const words = (state = { filterTerm: '', toHide: [] }, action) => {
  switch (action.type) {
  case UPDATE_MOST_USED_WORDS_SEARCH_FILTER:
    return {
      ...state,
      filterTerm: action.filterTerm
    };
  case TOGGLE_MOST_USED_WORD:
    return {
      ...state,
      toHide: toggleArrayElement(state.toHide, action.word)
    };
  default:
    return state;
  }
};

const users = (state = { filterTerm: '', toHide: [] }, action) => {
  switch (action.type) {
  case UPDATE_MOST_ACTIVE_USERS_SEARCH_FILTER:
    return {
      ...state,
      filterTerm: action.filterTerm
    };
  case TOGGLE_MOST_ACTIVE_USER:
    return {
      ...state,
      toHide: toggleArrayElement(state.toHide, action.userId)
    };
  default:
    return state;
  }
};

const toggleArrayElement = (array, element) => {
  const termIndex = array.indexOf(element);
  if (termIndex > -1) {
    return [
      ...array.slice(0, termIndex),
      ...array.slice(termIndex + 1),
    ];
  }

  return [...array, element];
};

export default combineReducers({
  words,
  users
});
