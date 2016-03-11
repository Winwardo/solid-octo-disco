export const updateMostUsedWordsSearch = (searchFor, filterTerm) => {
  return {
    'type': `UPDATE_SEARCH_${searchFor}`,
    filterTerm,
  };
};
