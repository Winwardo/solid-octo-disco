const SearchTermsReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_SEARCH_TERM':
      return [
      ...state,
      SearchTermReducer(undefined, action),
			];
    default:
      return state;
  };
};

const SearchTermReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_SEARCH_TERM':
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

export default SearchTermsReducer;
