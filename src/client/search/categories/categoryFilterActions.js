import { newPromiseChain, makeGetHeader, fetchPost } from './../../../shared/utilities';

import fetch from 'isomorphic-fetch';

export const REQUEST_FOOTBALL_SEASON = 'REQUEST_FOOTBALL_SEASON';
export const requestFootballSeason = (year) => ({
  type: REQUEST_FOOTBALL_SEASON,
  year,
});

export const RECEIVE_FOOTBALL_SEASON = 'RECEIVE_FOOTBALL_SEASON';
export const receiveFootballSeason = (year, json) => ({
  type: RECEIVE_FOOTBALL_SEASON,
  year,
  footballSeasons: json,
});

export const REMOVE_FOOTBALL_SEASON = 'REMOVE_FOOTBALL_SEASON';
export const removeFootballSeason = (year) => ({
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
          dispatch(receiveFootballSeason(year, json));
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
export const requestYearsFootballLeaguesTeams = (year) => ({
  type: REQUEST_YEARS_FOOTBALL_LEAGUES_TEAMS,
  year,
});

export const RECEIVE_YEARS_FOOTBALL_LEAGUES_TEAMS = 'RECEIVE_YEARS_FOOTBALL_LEAGUES_TEAMS';
export const receiveYearsFootballLeaguesTeams = (year, json) => ({
  type: RECEIVE_YEARS_FOOTBALL_LEAGUES_TEAMS,
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
            .map((season) => ({ id: season.id, name: season.caption })),
        }
      ))
      .then(results => results.json())
      .then(allSeasonsTeams =>
        dispatch(receiveYearsFootballLeaguesTeams(year, allSeasonsTeams.data.teamsByLeague))
      )
      .catch((error) => console.warn(`Major error fetching the ${year}'s' football leagues`, error))
  );

export const SELECT_AND_REQUEST_FOOTBALL_TEAM = 'SELECT_AND_REQUEST_FOOTBALL_TEAM';
export const selectAndRequestFootballTeam = (id, name, shortName, crestUrl) => ({
  type: SELECT_AND_REQUEST_FOOTBALL_TEAM,
  id,
  crestUrl,
  name,
  shortName,
});

export const RECEIVE_SELECTED_FOOTBALL_TEAM_PLAYERS = 'RECEIVE_SELECTED_FOOTBALL_TEAM_PLAYERS';
export const receiveSelectedFootballTeamPlayers = (json) => ({
  type: RECEIVE_SELECTED_FOOTBALL_TEAM_PLAYERS,
  footballTeamPlayers: json,
});

export const REMOVE_SELECTED_FOOTBALL_TEAM_PLAYERS = 'REMOVE_SELECTED_FOOTBALL_TEAM_PLAYERS';
export const removeSelectedFootballTeamPlayers = () => ({
  type: REMOVE_SELECTED_FOOTBALL_TEAM_PLAYERS,
});

export const fetchFootballTeamPlayers = (id, name, shortName, crestUrl) =>
  (dispatch) => (
    newPromiseChain()
      .then(() => dispatch(selectAndRequestFootballTeam(id, name, shortName, crestUrl)))
      .then(() => fetch(`/football/teams/${id}/players`, makeGetHeader()))
      .then(response => response.json())
      .then(json => dispatch(receiveSelectedFootballTeamPlayers(json)))
      .catch((error) => console.warn(`Major error fetching ${name}'s players`, error))
  );
