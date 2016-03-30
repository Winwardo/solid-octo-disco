export const UPDATE_SEARCH_MOST_USED_WORDS_FILTER = 'UPDATE_SEARCH_MOST_USED_WORDS_FILTER';
export const updateMostUsedwordsSearch = (filterTerm) => ({
  type: UPDATE_SEARCH_MOST_USED_WORDS_FILTER,
  filterTerm,
});

export const UPDATE_SEARCH_MOST_ACTIVE_USERS_FILTER = 'UPDATE_SEARCH_MOST_ACTIVE_USERS_FILTER';
export const updateActiveUsersSearch = (filterTerm) => ({
  type: UPDATE_SEARCH_MOST_ACTIVE_USERS_FILTER,
  filterTerm,
});

export const TOGGLE_MOST_USED_WORD = 'TOGGLE_MOST_USED_WORD';
export const toggleMostUsedWord = (word) => ({
  type: TOGGLE_MOST_USED_WORD,
  word,
});

export const TOGGLE_MOST_ACTIVE_USER = 'TOGGLE_MOST_ACTIVE_USER';
export const toggleMostActiveUser = (userId) => ({
  type: TOGGLE_MOST_ACTIVE_USER,
  userId,
});
