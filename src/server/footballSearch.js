import fetch from 'isomorphic-fetch';
import  { db } from './orientdb';
import { newPromiseChain } from './../shared/utilities';

// These keys should be hidden in a private config file or environment variables
// For simplicity of this assignment, they will be visible here
export const footballAccessOptions = {
  method: 'GET',
  headers: {
    'X-Auth-Token': 'f39c0cf21f95409498f8eea5eb129b0f',
    'X-Response-Control': 'minified',
  },
  dataType: 'json',
};

const footballAPIHost = 'http://api.football-data.org';
const footballAPIVersion = '/v1';

export const searchFootballSeasons = (res, year) => {
  const footballRequestUrl = `${footballAPIHost}${footballAPIVersion}/soccerseasons/?season=${year}`;

  return newPromiseChain()
    .then(() => db.query('SELECT FROM league WHERE year=:year', { params: { year: year } }))
    .then((results) => {
      if (results.length === 0) { // If our cache is empty, call the Football API
        return newPromiseChain()
          .then(() => fetchFromFootballAPI(footballRequestUrl))
          .then((footballSeasons) => cacheAPIJsonArray(db, 'League', footballSeasons.length > 0 ? footballSeasons : []));
      } else {
        return results; // Return our cached data
      }
    })
    .then(
      (footballSeasons) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(footballSeasons));
      },
      (rejection) => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end('An unexpected internal error occurred.');
        console.warn(`Unable to get ${year}`, rejection);
      });
};

export const searchFootballSeasonTeams = (res, year, leagues) =>
  newPromiseChain()
    .then(() =>
      Promise.all(
        leagues.map(
          league => newPromiseChain()
            .then(() => fetchLeagueTeamsById(league.id))
            .then(leagueTeams => ({
              name: league.name,
              id: league.id,
              ...leagueTeams,
            }))
        )
      )
    )
    .then(
      (allYearsLeagueTeams) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          data: {
            teamsByLeague: allYearsLeagueTeams,
          },
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
    .then(() => db.query('SELECT FROM team WHERE leagueid=:leagueid', { params: { leagueid: leagueId } }))
    .then((results) => {
      if (results.length === 0) {
        return newPromiseChain()
          .then(() => fetchFromFootballAPI(footballRequestUrl))
          .then((league) =>
            cacheAPIJsonArray(db, 'Team', league.teams.map(
              (team) => ({ ...team, leagueid: leagueId }))
            )
          );
      } else {
        return results;
      }
    })
    .then((teams) => ({ teams: teams }))
    .then(
      leagueTeamsResolved => leagueTeamsResolved,
      rejection => console.warn(`Major error requesting the league with id:${leagueId}.`, rejection)
    );
};

export const searchFootballTeamPlayers = (res, teamId) => {
  const footballRequestUrl = `${footballAPIHost}${footballAPIVersion}/teams/${teamId}/players`;

  return newPromiseChain()
    .then(() => db.query('SELECT FROM player WHERE teamid=:teamid', { params: { teamid: teamId } }))
    .then((results) => {
      if (results.length === 0) { // If our cache is empty, call the Football API
        return newPromiseChain()
          .then(() => fetchFromFootballAPI(footballRequestUrl))
          .then((league) =>
            cacheAPIJsonArray(db, 'Player', league.players.map(
              (player) => ({ ...player, teamid: teamId }))
            )
          );
      } else {
        return results; // Return our cached data
      }
    })
    .then((players) => ({ players: players }))
    .then(
      (footballPlayers) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(footballPlayers));
      },
      (rejection) => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end('An unexpected internal error occurred.');
        console.warn(`Unable to get ${teamId}`, rejection);
      });
};

export const fetchFromFootballAPI = (footballRequestUrl) => (
  newPromiseChain()
    .then(() => console.info('Hitting Football API:', footballRequestUrl))
    .then(() => fetch(footballRequestUrl, footballAccessOptions))
    .then(response => response.json())
);

const cacheAPIJsonArray = (db, datatype, dataArray) => (
  newPromiseChain()
    .then(() => Promise.all(// Insert all the seasons to our cache
      dataArray.map(
        (data) => db.insert().into(datatype).set(data).one()
          .then((res) => {}, (rej) => {}))
    ))
    .then(() => {
      if (dataArray.length > 0) {
        return dataArray;
      } else {
        return {};
      }
    }) // Return the actual API data as we already have it
);
