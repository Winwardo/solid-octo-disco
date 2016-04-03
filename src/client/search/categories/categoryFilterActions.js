import { newPromiseChain, makeGetHeader } from './../../../shared/utilities';

import fetch from 'isomorphic-fetch';

export const REQUEST_FOOTBALL_SEASONS = 'REQUEST_FOOTBALL_SEASONS';
const requestFootballSeasons = (year) => ({
  type: REQUEST_FOOTBALL_SEASONS,
  year
});

export const RECIEVE_FOOTBALL_SEASONS = 'RECIEVE_FOOTBALL_SEASONS';
const recieveFootballSeasons = (year, json) => ({
  type: RECIEVE_FOOTBALL_SEASONS,
  year,
  footballSeasons: json
});


export const fetchAllFootballSeasons = (year) => {
  return (dispatch) => (
    newPromiseChain()
      .then(() => {
        if(year !== 2012){
          return dispatch(requestFootballSeasons(year))
        } else {
          return Promise.resolve();
        }
      })
      .then(() => fetch(`/football/seasons/${year}`, makeGetHeader()))
      .then(response => response.json())
      .then(json => {
        const nextYearToCheck = year - 1;
        if (json.length > 0) {
          dispatch(recieveFootballSeasons(year, json));
          return dispatch(fetchAllFootballSeasons(nextYearToCheck));
        } else {
          return Promise.resolve();
        }
      })
      .catch((error) => console.warn('Major error fetching the football seasons', error))
  );
}
