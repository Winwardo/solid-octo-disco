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
  fetchDataAndRespond(res, footballRequestUrl, `${year}'s football seasons`);
};

export const searchFootballSeasonTeams = (res, year, leagues) =>
  newPromiseChain()
    .then(() =>
      Promise.all(
        leagues.map(
          league => {
            let leagueTeams = fetchLeagueTeamsById(league.id);
            console.log('fetched', leagueTeams);
            return ({
              league: league.name,
              id: league.id,
              ...leagueTeams,
            });
          }
        )
      )
    )
    .then(
      (allYearsLeagueTeams) => {
        console.log('resolved', allYearsLeagueTeams);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          data: {
            teamsByLeague: allYearsLeagueTeams
          }
        }));
      },
      (rejection) => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end('An unexpected internal error occurred.');
        console.warn(`Unable to search for query year:${year}'s league's teams`, rejection);
      }
  );

const fetchLeagueTeamsById = (leagueId) => {
  const footballRequestUrl = `${footballAPIHost}${footballAPIVersion}/soccerseasons/${leagueId}/teams`;
  return newPromiseChain()
    .then(() => fetch(footballRequestUrl, footballAccessOptions))
    .then(response => response.json())
    .then(
      leagueTeamsResolved => leagueTeamsResolved,
      rejection => console.warn(`Major error reqesting the league with id:${leagueId}.`, rejection)
    );
};

const fetchDataAndRespond = (res, url, name) => {
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
