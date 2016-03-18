import 'babel-polyfill';
import { ADD_SEARCH_TERM, RECEIVE_FEED_RESULTS, DELETE_SEARCH_TERM } from './searchActions';

export const searchTermsReducer = (state = [], action) => {
  switch (action.type) {
  case ADD_SEARCH_TERM:
    return [
      ...state,
      searchTermReducer(undefined, action),
    ];
  case DELETE_SEARCH_TERM: {
    if (state.length === 1) return [];
    const termIndex = state.findIndex(term => term.id === action.id);
    return [
      ...state.slice(0, termIndex),
      ...state.slice(termIndex + 1)
    ];
  }
  default:
    return state;
  }
};

export const feedReducer = (state = [], action) => {
  switch (action.type) {
  case RECEIVE_FEED_RESULTS:
    return {
      posts: action.data
    };
  default:
    return state;
  }
};

const searchTermReducer = (state, action) => {
  switch (action.type) {
  case ADD_SEARCH_TERM:
    return {
      id: action.id,
      query: action.query,
      paramTypes: action.paramTypes,
      source: action.source,
    };
  default:
    return state;
  }
};
