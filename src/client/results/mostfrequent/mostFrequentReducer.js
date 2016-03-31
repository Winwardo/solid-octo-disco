import { combineReducers } from 'redux';
import { toggleArrayElement } from './../../../shared/utilities';
import {
  UPDATE_MOST_USED_WORDS_SEARCH_FILTER, TOGGLE_MOST_USED_WORD,
  UPDATE_MOST_ACTIVE_USERS_SEARCH_FILTER, TOGGLE_MOST_ACTIVE_USER
} from './mostFrequentActions';

const words = (state = { filterTerm: '', toHide: [] }, action) => {
  switch (action.type) {
  case UPDATE_MOST_USED_WORDS_SEARCH_FILTER:
    return {
      ...state,
      filterTerm: action.filterTerm,
    };
  case TOGGLE_MOST_USED_WORD:
    return {
      ...state,
      toHide: toggleArrayElement(state.toHide, action.word),
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
      filterTerm: action.filterTerm,
    };
  case TOGGLE_MOST_ACTIVE_USER:
    return {
      ...state,
      toHide: toggleArrayElement(state.toHide, action.userId),
    };
  default:
    return state;
  }
};

export default combineReducers({
  words,
  users,
});
