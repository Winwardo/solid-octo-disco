import { fetchPost, newPromiseChain } from '../../shared/utilities';
import { doesFeedHaveUsefulResults } from '../tweetAnalysis';

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
    newPromiseChain()
      .then(() => NProgress.start())
      .then(() => searchDatabaseAsCache(dispatch, searchTerms))
      .then(feedResults => searchTwitterIfResultsArentGoodEnough(dispatch, searchTerms, feedResults))
      .then(() => NProgress.done())
);

const searchTwitterIfResultsArentGoodEnough = (dispatch, searchTerms, feedResults) => {
  if (!doesFeedHaveUsefulResults(feedResults)) {
    return searchDatabaseAndTwitter(dispatch, searchTerms);
  } else {
    return Promise.resolve();
  }
};

const searchDatabaseAndTwitter = (dispatch, searchTerms) => searchDatabase(dispatch, searchTerms, true);
const searchDatabaseAsCache = (dispatch, searchTerms) =>searchDatabase(dispatch, searchTerms, false);

const searchDatabase = (dispatch, searchTerms, searchTwitter) =>
  newPromiseChain()
  .then(() => fetchPost('/search', { searchTerms: searchTerms, searchTwitter: searchTwitter }))
  .then(response => response.json())
  .then(feedResults => {
    dispatch({ type: RECEIVE_FEED_RESULTS, data: feedResults });
    return feedResults;
  });

export const DELETE_SEARCH_TERM = 'DELETE_SEARCH_TERM';
export const deleteSearchTerm = (id) => ({
  type: DELETE_SEARCH_TERM,
  id,
});

export const TOGGLE_SEARCH_TERM_PARAMTYPE_SELECTION = 'TOGGLE_SEARCH_TERM_PARAMTYPE_SELECTION';
export const toggleSearchTermParamTypeSelection = (id, paramTypeName) => ({
  type: TOGGLE_SEARCH_TERM_PARAMTYPE_SELECTION,
  id,
  paramTypeName,
});

export const SET_FEED_PAGE_NUMBER = 'SET_FEED_PAGE_NUMBER';
export const setFeedPageNumber = (number) => ({
  type: SET_FEED_PAGE_NUMBER,
  number,
});

export const SET_FEED_PAGE_LIMIT = 'SET_FEED_PAGE_LIMIT';
export const setFeedPageLimit = (limit) => ({
  type: SET_FEED_PAGE_LIMIT,
  limit,
});
