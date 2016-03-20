import { ADD_SEARCH_TERM, RECEIVE_FEED_RESULTS } from './SearchActions';

export const searchReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_SEARCH_TERM:
      return [
          ...state,
          SearchTermReducer(undefined, action),
        ];
    default:
      return state;
  };
};

export const feedReducer = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_FEED_RESULTS:
      return action.data.data.records;
    default:
      return state;
  };
};

const SearchTermReducer = (state, action) => {
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
  };
};
