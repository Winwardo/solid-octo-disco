import fetch from 'isomorphic-fetch';
import { newPromiseChain } from './../shared/utilities';

// These keys should be hidden in a private config file or environment variables
// For simplicity of this assignment, they will be visible here
const footballAccessOptions = {
  method: 'GET',
  headers: { 'X-Auth-Token': 'f39c0cf21f95409498f8eea5eb129b0f' },
  dataType: 'json',
};

const footballAPIHost = 'http://api.football-data.org';
const footballAPIVersion = '/v1';

export const searchFootballSeasons = (res, year) => {
  const footballRequestUrl = `${footballAPIHost}${footballAPIVersion}/soccerseasons/?season=${year}`;
  fetchData(res, footballRequestUrl, `${year}'s football seasons`);
};

export const searchFootballSeasonTeams = (res, id) => {
  const footballRequestUrl = `${footballAPIHost}${footballAPIVersion}/soccerseasons/${id}/teams`;
  fetchData(res, footballRequestUrl, `football season with id=${id}' teams`);
};

const fetchData = (res, url, name) => {
  newPromiseChain()
    .then(() => fetch(url, footballAccessOptions))
    .then(response => response.json())
    .then(
      footballSeasons => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(footballSeasons));
      },
      (rejection) => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end('An unexpected internal error occurred.');
        console.warn(`Unable to get ${name}`, rejection);
      });
};
