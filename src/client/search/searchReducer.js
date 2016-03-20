
import {
  ADD_SEARCH_TERM, TOGGLE_SEARCH_TERM_PARAMTYPE_SELECTION, DELETE_SEARCH_TERM,
  RECEIVE_FEED_RESULTS
} from './searchActions';
import { createTwitterParamTypes } from '../../shared/utilities';

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
      ...state.slice(termIndex + 1)
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

    const newParamTypes = state.paramTypes.map((paramType) => {
      if (paramType.name !== action.paramTypeName) {
        return paramType;
      }

      return {
        ...paramType,
        selection: !paramType.selection
      };
    });

    return {
      ...state,
      newParamTypes
    };
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
