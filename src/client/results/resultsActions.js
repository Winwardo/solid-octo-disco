export const UPDATE_SEARCH_MOST_USED_WORDS_FILTER = 'UPDATE_SEARCH_MOST_USED_WORDS_FILTER';
export const updateMostUsedwordsSearch = (filterTerm) => ({
  type: UPDATE_SEARCH_MOST_USED_WORDS_FILTER,
  filterTerm,
});

export const TOGGLE_MOST_USED_WORD = 'TOGGLE_MOST_USED_WORD';
export const toggleMostUsedWord = (word) => ({
  type: TOGGLE_MOST_USED_WORD,
  word,
});
