export const HIDE_MOST_USED_WORD = 'HIDE_MOST_USED_WORD';
export const SHOW_MOST_USED_WORD = 'SHOW_MOST_USED_WORD';

export const updateMostUsedWordsSearch = (searchFor, filterTerm) => ({
  'type': `UPDATE_SEARCH_${searchFor}`,
  filterTerm,
});

export const hideMostUsedWord = (word) => ({
  type: HIDE_MOST_USED_WORD,
  word,
});

export const showMostUsedWord = (word) => ({
  type: SHOW_MOST_USED_WORD,
  word,
});
