export const TOGGLE_MOST_USED_WORD = 'TOGGLE_MOST_USED_WORD';

export const updateMostUsedWordsSearch = (searchFor, filterTerm) => ({
  type: `UPDATE_SEARCH_${searchFor}`,
  filterTerm,
});

export const toggleMostUsedWord = (word) => ({
  type: TOGGLE_MOST_USED_WORD,
  word,
});
