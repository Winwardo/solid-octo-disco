import { toggleArrayElement } from '../../../../shared/utilities';
import {
  UPDATE_MOST_USED_WORDS_SEARCH_FILTER, TOGGLE_MOST_USED_WORDS,
  UPDATE_MOST_ACTIVE_USERS_SEARCH_FILTER, TOGGLE_MOST_ACTIVE_USER,
  TOGGLE_ALL_MOST_USED_WORDS, TOGGLE_ALL_MOST_ACTIVE_USERS,
  RESET_MOST_FREQUENT
} from './mostFrequentActions';

const mostFrequentInitialState = {
  filterTerm: '',
  toToggle: [],
  isToggledActionHide: true,
};

const initialState = {
  words: mostFrequentInitialState,
  users: mostFrequentInitialState,
};

const mostFrequentReducer = (state = initialState, action) => {
  switch (action.type) {
  case RESET_MOST_FREQUENT:
    return initialState;
  case UPDATE_MOST_ACTIVE_USERS_SEARCH_FILTER:
  case TOGGLE_MOST_ACTIVE_USER:
  case TOGGLE_ALL_MOST_ACTIVE_USERS:
    return {
      ...state,
      users: users(state.users, action),
    };
  case UPDATE_MOST_USED_WORDS_SEARCH_FILTER:
  case TOGGLE_MOST_USED_WORDS:
  case TOGGLE_ALL_MOST_USED_WORDS:
    return {
      ...state,
      words: words(state.words, action),
    };
  default:
    return state;
  }
};

const words = (state, action) => {
  switch (action.type) {
  case UPDATE_MOST_USED_WORDS_SEARCH_FILTER:
    return {
      ...state,
      filterTerm: action.filterTerm,
    };
  case TOGGLE_MOST_USED_WORDS:
    return {
      ...state,
      toToggle: action.words.reduce(
        (toggledWords, word) => toggleArrayElement(toggledWords, word), state.toToggle
      ),
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

const users = (state, action) => {
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

export default mostFrequentReducer;
