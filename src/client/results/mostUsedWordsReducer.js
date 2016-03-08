const MostUsedWordsReducer = (state = {'filterTerm': ''}, action) => {
  switch (action.type) {
    case 'UPDATE_MOST_USED_WORDS_FILTER':
      return {...state, 'filterTerm': action.value}
    default:
      return state;
  };
};

export default MostUsedWordsReducer;