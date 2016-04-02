export const UPDATE_MOST_USED_WORDS_SEARCH_FILTER = 'UPDATE_MOST_USED_WORDS_SEARCH_FILTER';
export const updateMostUsedWordsSearch = (filterTerm) => ({
  type: UPDATE_MOST_USED_WORDS_SEARCH_FILTER,
  filterTerm,
});

export const UPDATE_MOST_ACTIVE_USERS_SEARCH_FILTER = 'UPDATE_MOST_ACTIVE_USERS_SEARCH_FILTER';
export const updateActiveUsersSearch = (filterTerm) => ({
  type: UPDATE_MOST_ACTIVE_USERS_SEARCH_FILTER,
  filterTerm,
});

export const TOGGLE_MOST_USED_WORDS = 'TOGGLE_MOST_USED_WORDS';
export const toggleMostUsedWord = (words) => ({
  type: TOGGLE_MOST_USED_WORDS,
  words,
});

export const TOGGLE_MOST_ACTIVE_USER = 'TOGGLE_MOST_ACTIVE_USER';
export const toggleMostActiveUser = (userId) => ({
  type: TOGGLE_MOST_ACTIVE_USER,
  userId,
});

export const TOGGLE_ALL_MOST_USED_WORDS = 'TOGGLE_ALL_MOST_USED_WORDS';
export const toggleAllMostUsedWordsSearch = () => ({
  type: TOGGLE_ALL_MOST_USED_WORDS,
});

export const TOGGLE_ALL_MOST_ACTIVE_USERS = 'TOGGLE_ALL_MOST_ACTIVE_USERS';
export const toggleAllMostActiveUsersSearch = () => ({
  type: TOGGLE_ALL_MOST_ACTIVE_USERS,
});
