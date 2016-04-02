import {
  ADD_SEARCH_TERM, TOGGLE_SEARCH_TERM_PARAMTYPE_SELECTION, DELETE_SEARCH_TERM,
  RECEIVE_FEED_RESULTS, SET_FEED_PAGE_NUMBER, SET_FEED_PAGE_LIMIT
} from './searchActions';
import { createTwitterParamTypes, toggleParamType } from '../../shared/utilities';
import { groupedCountWords, mostFrequentWords, mostFrequentUsers } from './../tweetAnalysis';

export const searchTermsReducer = (state = [], action) => {
  switch (action.type) {
  case ADD_SEARCH_TERM:
    return [
      ...state,
      searchTermReducer(undefined, action),
    ];
  case TOGGLE_SEARCH_TERM_PARAMTYPE_SELECTION:
    return state.map(searchTerm => searchTermReducer(searchTerm, action));
  case DELETE_SEARCH_TERM: {
    if (state.length === 1) return [];

    const termIndex = state.map(term => (term.id)).indexOf(action.id);
    return [
      ...state.slice(0, termIndex),
      ...state.slice(termIndex + 1),
    ];
  }

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
      paramTypes: createTwitterParamTypes(action.paramTypes),
      source: action.source,
    };
  case TOGGLE_SEARCH_TERM_PARAMTYPE_SELECTION: {
    if (state.id !== action.id) {
      return state;
    }

    return {
      ...state,
      paramTypes: toggleParamType(state.paramTypes, action.paramTypeName),
    };
  }

  default:
    return state;
  }
};

export const feedReducer = (state = { posts: [], paginationInfo: { number: 1, limit: 10 }, groupedMostFrequentWords: [], mostFrequentUsers: [] }, action) => {
  switch (action.type) {
  case RECEIVE_FEED_RESULTS:
    return {
      ...state,
      posts: action.data.data.records,
      groupedMostFrequentWords: groupedCountWords(mostFrequentWords(action.data.data.records.map((post) => post.data.content))),
      mostFrequentUsers: mostFrequentUsers(action.data.data.records),
    };
  case SET_FEED_PAGE_NUMBER:
    return { ...state, paginationInfo: { ...state.paginationInfo, number: action.number } };
  case SET_FEED_PAGE_LIMIT:
    return { ...state, paginationInfo: { ...state.paginationInfo, limit: action.limit } };
  default:
    return state;
  }
};

