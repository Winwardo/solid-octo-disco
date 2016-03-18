import { fetchPost, chainPromises } from '../../shared/utilities';

export const ADD_SEARCH_TERM = 'ADD_SEARCH_TERM';
export const addSearchTerm = (id, query) => {
  const searchQuery = {
    type: ADD_SEARCH_TERM,
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
};

const addQueryParamTypes = (searchQuery, query, paramTypes) => ({
  ...searchQuery,
  query,
  paramTypes,
});

export const INVALIDATE_FEED_RESULTS = 'INVALIDATE_FEED_RESULTS';
export const invalidateFeedResults = () =>
  (dispatch, getState) => {
    dispatch({ type: INVALIDATE_FEED_RESULTS });
    dispatch(searchApiForFeed(getState().searchTerms));
  };

export const RECEIVE_FEED_RESULTS = 'RECEIVE_FEED_RESULTS';
export const searchApiForFeed = (searchTerms) =>
(dispatch) => (
  chainPromises(() => (fetchPost('/search', searchTerms)))
  .then(response => (response.json()))
  .then(json => {
    dispatch({ type: RECEIVE_FEED_RESULTS, data: json });
  })
);

export const DELETE_SEARCH_TERM = 'DELETE_SEARCH_TERM';
export const deleteSearchTerm = (id) => ({
  type: DELETE_SEARCH_TERM,
  id
});
