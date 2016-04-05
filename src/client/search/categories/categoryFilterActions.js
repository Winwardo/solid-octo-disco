import { newPromiseChain, makeGetHeader, fetchPost } from './../../../shared/utilities';

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

export const fetchAllFootballSeasons = (year, isFirstYear) =>
  dispatch => (
    newPromiseChain()
      .then(() => dispatch(requestFootballSeason(year)))
      .then(() => fetch(`/football/seasons/${year}`, makeGetHeader()))
      .then(response => response.json())
      .then(json => {
        const nextYearToCheck = year - 1;
        if (json.length > 0) {
          dispatch(recieveFootballSeason(year, json));
          if (isFirstYear) {
            dispatch(fetchAllFootballLeagueTeams(year));
          }
          return dispatch(fetchAllFootballSeasons(nextYearToCheck, false));
        } else if (json.length === undefined) {
          dispatch(removeFootballSeason(year));
          return Promise.resolve();
        } else {
          dispatch(removeFootballSeason(year));
          return dispatch(fetchAllFootballSeasons(nextYearToCheck, false));
        }
      })
      .catch((error) => console.warn('Major error fetching the football seasons', error))
);

export const REQUEST_YEARS_FOOTBALL_LEAGUES_TEAMS = 'REQUEST_YEARS_FOOTBALL_LEAGUES_TEAMS';
const requestYearsFootballLeaguesTeams = (year) => ({
  type: REQUEST_YEARS_FOOTBALL_LEAGUES_TEAMS,
  year,
});

export const RECIEVE_YEARS_FOOTBALL_LEAGUES_TEAMS = 'RECIEVE_YEARS_FOOTBALL_LEAGUES_TEAMS';
const recieveYearsFootballLeaguesTeams = (year, json) => ({
  type: RECIEVE_YEARS_FOOTBALL_LEAGUES_TEAMS,
  year,
  footballLeagues: json,
});

export const fetchAllFootballLeagueTeams = (year) =>
  (dispatch, getState) => (
    newPromiseChain()
      .then(() => dispatch(requestYearsFootballLeaguesTeams(year)))
      .then(() => fetchPost(
        `/football/seasons/${year}/teams`,
        {
          leagues: getState().football.seasonsByYear[year].seasons
            .map((season) => ({ id: season.id, name: season.caption }))
        }
      ))
      .then(results => results.json())
      .then(allSeasonsTeams =>
        dispatch(recieveYearsFootballLeaguesTeams(year, allSeasonsTeams.data.teamsByLeague))
      )
  );
