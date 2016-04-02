import { combineReducers } from 'redux';
import { toggleArrayElement } from './../../../shared/utilities';
import {
  UPDATE_MOST_USED_WORDS_SEARCH_FILTER, TOGGLE_MOST_USED_WORD,
  UPDATE_MOST_ACTIVE_USERS_SEARCH_FILTER, TOGGLE_MOST_ACTIVE_USER,
  TOGGLE_ALL_MOST_USED_WORDS, TOGGLE_ALL_MOST_ACTIVE_USERS
} from './mostFrequentActions';

const words = (state = { filterTerm: '', toToggle: [], isToggledActionHide: true }, action) => {
  switch (action.type) {
  case UPDATE_MOST_USED_WORDS_SEARCH_FILTER:
    return {
      ...state,
      filterTerm: action.filterTerm,
    };
  case TOGGLE_MOST_USED_WORD:
    return {
      ...state,
      toToggle: toggleArrayElement(state.toToggle, action.word),
    };
  case TOGGLE_ALL_MOST_USED_WORDS:
    return {
      ...state,
      toToggle: [],
      isToggledActionHide: !state.isToggledActionHide,
    };
  default:
    return state;
  }
};

const users = (state = { filterTerm: '', toToggle: [], isToggledActionHide: true }, action) => {
  switch (action.type) {
  case UPDATE_MOST_ACTIVE_USERS_SEARCH_FILTER:
    return {
      ...state,
      filterTerm: action.filterTerm,
    };
  case TOGGLE_MOST_ACTIVE_USER:
    return {
      ...state,
      toToggle: toggleArrayElement(state.toToggle, action.userId),
    };
  case TOGGLE_ALL_MOST_ACTIVE_USERS:
    return {
      ...state,
      toToggle: [],
      isToggledActionHide: !state.isToggledActionHide,
    };
  default:
    return state;
  }
};

export default combineReducers({
  words,
  users,
});
