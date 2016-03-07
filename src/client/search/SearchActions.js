export const addSearchTerm = (id, query) => {
  const searchQuery = {
    type: 'ADD_SEARCH_TERM',
    id,
    source: 'twitter',
  };

  switch (query.charAt(0)) {
    case '#':
      return addQueryParamTypes(searchQuery, query.substring(1), ['hashtag']);
    case '@':
      return addQueryParamTypes(searchQuery, query.substring(1), ['author', 'mention']);
    default:
      return addQueryParamTypes(searchQuery, query, ['author', 'hashtag', 'keyword', 'mention']);
  }
};;

const addQueryParamTypes = (searchQuery, query, paramTypes) => {
  return {
    ...searchQuery,
    query,
    paramTypes,
  };
};
