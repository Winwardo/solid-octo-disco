import { fetchPost, newPromiseChain, makeGetHeader } from '../../shared/utilities';
import { doesFeedHaveUsefulResults } from '../tweetAnalysis';
import { resetMostFrequent } from './../results/socialweb/mostfrequent/mostFrequentActions';

import fetch from 'isomorphic-fetch';

let nextSearchTermId = 0;
let lastSearchRequestId = 0;

export const PLAYER_ENTITY = 'player';
export const TEAM_ENTITY = 'team';
export const ADD_SEARCH_TERM = 'ADD_SEARCH_TERM';
export const addSearchTerm = (query, entity, details) => {
  let searchQuery = {
    type: ADD_SEARCH_TERM,
    id: nextSearchTermId++,
    source: 'twitter',
    entity,
  };

  if (details) {
    searchQuery.details = details;
  }

  switch (query.charAt(0)) {
  case '#':
    return addQueryParamTypes(searchQuery, query.substring(1), ['hashtag']);
  case '*':
    return addQueryParamTypes(searchQuery, query.substring(1), ['keyword']);
  case '@':
    return addQueryParamTypes(searchQuery, query.substring(1), ['author', 'mention']);
  case '^':
    switch (query.charAt(1)) {
    case '#':
      return addQueryParamTypes(searchQuery, query.substring(2), ['author', 'keyword', 'mention']);
    case '*':
      return addQueryParamTypes(searchQuery, query.substring(2), ['author', 'hashtag', 'mention']);
    case '@':
      return addQueryParamTypes(searchQuery, query.substring(2), ['hashtag', 'keyword']);
    default:
      return addQueryParamTypes(searchQuery, query.substring(1), ['author', 'hashtag', 'keyword', 'mention']);
    }
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
export const invalidateFeedResults = () => {
  const newSearchRequestId = lastSearchRequestId++;
  return (dispatch, getState) => {
    dispatch({ type: INVALIDATE_FEED_RESULTS, requestId: newSearchRequestId });
    dispatch(searchApiForFeed(getState().searchTerms, getState().searchOnlyDB, newSearchRequestId));
  };
};

const searchApiForFeed = (searchTerms, onlySearchDBCache, requestId) =>
    (dispatch) => (
    newPromiseChain()
      .then(() => NProgress.start())
      .then(() => searchDatabaseAsCache(dispatch, searchTerms, requestId))
      .then(feedResults => {
        if (!onlySearchDBCache) {
          return searchTwitterIfResultsArentGoodEnough(dispatch, searchTerms, requestId, feedResults);
        }
      })
      .then(() => NProgress.done())
);

const searchTwitterIfResultsArentGoodEnough = (dispatch, searchTerms, requestId, feedResults) => {
  if (!doesFeedHaveUsefulResults(feedResults)) {
    return searchDatabaseAndTwitter(dispatch, searchTerms, requestId);
  } else {
    return Promise.resolve();
  }
};

const searchDatabaseAndTwitter = (dispatch, searchTerms, requestId) =>
  searchDatabase(dispatch, searchTerms, requestId, true);
const searchDatabaseAsCache = (dispatch, searchTerms, requestId) =>
  searchDatabase(dispatch, searchTerms, requestId, false);

const searchDatabase = (dispatch, searchTerms, requestId, searchTwitter) =>
  newPromiseChain()
    .then(() => dispatch(resetMostFrequent()))
    .then(() => fetchPost('/search', { searchTerms, searchTwitter }))
    .then(response => response.json())
    .then(feedResults => {
      if (searchTwitter) {
        dispatch(receiveFeedResults(feedResults, requestId, true));
      }
      dispatch(receiveFeedResults(feedResults, requestId, false));
      return feedResults;
    });

export const RECEIVE_FEED_RESULTS = 'RECEIVE_FEED_RESULTS';
const receiveFeedResults = (data, requestId, recievedFromTwitter) => ({
  type: RECEIVE_FEED_RESULTS,
  data,
  requestId,
  fetchedRequestFromTwitter: recievedFromTwitter,
});

export const INVALIDATE_JOURNALISM_INFORMATION = 'INVALIDATE_JOURNALISM_INFORMATION';
export const REQUEST_ENTITY = 'REQUEST_ENTITY';
export const RECEIVE_ENTITY = 'RECEIVE_ENTITY';
export const invalidateJournalismInfo = () =>
  (dispatch, getState) => {
    let invalidated = false;
    getState().searchTerms.forEach(searchTerm => {
      if (searchTerm.entity) {
        // only requests the entity from dbpedia if it hasn't already been fetched.
        if (!getState().journalismInfo.entities[searchTerm.id]) {
          // only invalidates journalismInfo if there is an entity in the search terms list
          // and it has not already been invalidated.
          if (!invalidated) {
            dispatch({ type: INVALIDATE_JOURNALISM_INFORMATION });
            invalidated = true;
          }

          dispatch({
            type: REQUEST_ENTITY,
            id: searchTerm.id,
            query: searchTerm.query,
            entityType: searchTerm.entity,
            details: searchTerm.details,
          });

          // hits different end points depending on whether it's a player or team being queried.
          switch (searchTerm.entity) {
          case PLAYER_ENTITY:
            newPromiseChain()
              .then(() => fetch(`/journalism/players/${searchTerm.query}`, makeGetHeader()))
              .then(response => response.json())
              .then()
              .then(json => dispatch({
                type: RECEIVE_ENTITY,
                id: searchTerm.id,
                entityInfo: json,
              }));
            break;
          case TEAM_ENTITY:
            newPromiseChain()
              .then(() => fetch(
                `/journalism/teams/${searchTerm.query}/${searchTerm.details.footballDataOrgTeamId}`,
                makeGetHeader()
              )).then(response => response.json())
              .then(json => dispatch({
                type: RECEIVE_ENTITY,
                id: searchTerm.id,
                entityInfo: json,
              }));
            break;
          default:
            break;
          }
        }
      }
    });
  };

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

export const TOGGLE_SEARCH_ONLY_DB = 'TOGGLE_SEARCH_ONLY_DB';
export const toggleSearchOnlyDb = () => ({
  type: TOGGLE_SEARCH_ONLY_DB,
});
