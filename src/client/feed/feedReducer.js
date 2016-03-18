const FeedReducer = (state = { 'posts': [] }, action) => {
  switch (action.type) {
    case 'UPDATE_SEARCH_MOST_USED_WORDS_FILTER':
      return { ...state, 'filterTerm': action.filterTerm };
    default:
      return state;
  };
};

export default FeedReducer;
