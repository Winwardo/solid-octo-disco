import { newPromiseChain, makeGetHeader } from './../../../shared/utilities';

import fetch from 'isomorphic-fetch';

export const REQUEST_FOOTBALL_SEASON = 'REQUEST_FOOTBALL_SEASON';
const requestFootballSeason = (year) => ({
  type: REQUEST_FOOTBALL_SEASON,
  year,
});

export const RECIEVE_FOOTBALL_SEASON = 'RECIEVE_FOOTBALL_SEASON';
const recieveFootballSeason = (year, json) => ({
  type: RECIEVE_FOOTBALL_SEASON,
  year,
  footballSeasons: json,
});

export const REMOVE_FOOTBALL_SEASON = 'REMOVE_FOOTBALL_SEASON';
const removeFootballSeason = (year) => ({
  type: REMOVE_FOOTBALL_SEASON,
  year,
});

export const fetchAllFootballSeasons = (year) =>
  dispatch => (
    newPromiseChain()
      .then(() => dispatch(requestFootballSeason(year)))
      .then(() => fetch(`/football/seasons/${year}`, makeGetHeader()))
      .then(response => response.json())
      .then(json => {
        const nextYearToCheck = year - 1;
        if (json.length > 0) {
          dispatch(recieveFootballSeason(year, json));
          return dispatch(fetchAllFootballSeasons(nextYearToCheck));
        } else if (json.length === undefined) {
          dispatch(removeFootballSeason(year));
          return Promise.resolve();
        } else {
          dispatch(removeFootballSeason(year));
          return dispatch(fetchAllFootballSeasons(nextYearToCheck));
        }
      })
      .catch((error) => console.warn('Major error fetching the football seasons', error))
);
