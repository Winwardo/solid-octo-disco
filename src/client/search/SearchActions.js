import fetch from 'isomorphic-fetch';

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

const addQueryParamTypes = (searchQuery, query, paramTypes) => {
  return {
    ...searchQuery,
    query,
    paramTypes,
  };
};

export const INVALIDATE_FEED_RESULTS = 'INVALIDATE_FEED_RESULTS';
export function invalidateFeedResults() {
  return function(dispatch, getState) {
    dispatch({'type': INVALIDATE_FEED_RESULTS});
    dispatch(searchOrientThing(getState().searchTerms))
  };
};

const POST_HEADERS = {
  'Accept': 'application/json',
    'Content-Type': 'application/json'
};

export const UPDATE_SEARCH_RESULTS = 'UPDATE_SEARCH_RESULTS';
export function searchOrientThing(searchTerms) {
  return function(dispatch) {
    return fetch("/search", {
      'method': 'POST',
      'headers': POST_HEADERS,
      'body': JSON.stringify(searchTerms)
    }).then(response => {
      return response.json()
    }).then(json => {
      dispatch({'type': UPDATE_SEARCH_RESULTS, 'data': json});
    });
  }
}