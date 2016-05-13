const { SparqlClient, SPARQL } = require('sparql-client-2');
import { newPromiseChain } from '../shared/utilities';

const client =
  new SparqlClient('http://dbpedia.org/sparql')
    .register({
      db: 'http://dbpedia.org/resource/',
      dbpedia: 'http://dbpedia.org/property/',
    });

export const journalismTeam = (res, team) => {
  const clubPlayers = client
    .query(`
      SELECT * WHERE {
        dbr:${team} <http://dbpedia.org/ontology/wikiPageRedirects> ?team .
        ?team a <http://dbpedia.org/ontology/SoccerClub> .
        ?player <http://dbpedia.org/property/currentclub> ?team .
        ?player <http://dbpedia.org/property/fullname> ?name
      }
    `)
    .execute();

  const clubDescription = client
    .query(`
      SELECT * WHERE {
        dbr:${team} <http://dbpedia.org/ontology/wikiPageRedirects> ?team .
        ?team a <http://dbpedia.org/ontology/SoccerClub> .
        ?team <http://dbpedia.org/ontology/abstract> ?abstract .
        FILTER(langMatches(lang(?abstract), "EN"))
      }
    `)
    .execute();

  const groundsDescription = client
    .query(`
        SELECT * WHERE {
          dbr:${team} <http://dbpedia.org/ontology/wikiPageRedirects> ?team .
          ?team a <http://dbpedia.org/ontology/SoccerClub> .
          ?team <http://dbpedia.org/ontology/ground> ?grounds .
          ?grounds <http://dbpedia.org/property/name> ?groundname .
          ?grounds <http://dbpedia.org/ontology/thumbnail> ?thumbnail

          FILTER(langMatches(lang(?groundname), "EN"))
        }
      `)
    .execute();

  newPromiseChain()
    .then(() => Promise.all([clubPlayers, clubDescription, groundsDescription]))
    .then(
      results => {
        const players = extractPlayers(results[0]);
        const clubInfo = extractClubInfo(results[1]);
        const groundsInfo = extractGroundsInfo(results[2]);

        res.end(JSON.stringify({ players, clubInfo, groundsInfo }));
      },
      rej => {
        console.log(rej);
        res.status(500).end(`Unable to retrieve information about team ${team}.`);
      }
    );
};

const extractPlayers = (rawPlayersJson) => {
  const defaultObject = [];

  try {
    const rawPlayers = rawPlayersJson.results.bindings;
    return rawPlayers.map((player) => ({
        name: player.name.value,
        source: player.player.value,
      }));
  } catch (err) {
    console.warn(`Unable to find players for team ${team}.`);
    return defaultObject;
  }
};

const extractClubInfo = (rawClubJson) => {
  const defaultObject = { abstract: 'No description available.' };

  try {
    const clubInfoRaw = rawClubJson.results.bindings[0];
    return {
      ...defaultObject,
      abstract: clubInfoRaw.abstract.value,
    };
  } catch (err) {
    console.log(`Unable to retrieve club info for ${team}.`);
    return defaultObject;
  }
};

const extractGroundsInfo = (rawGroundsJson) => {
  const defaultObject = { name: 'No name available.', thumbnail: 'none' };

  try {
    const groundsInfoRaw = rawGroundsJson.results.bindings[0];
    return {
      ...defaultObject,
      name: groundsInfoRaw.groundname.value,
      thumbnail: groundsInfoRaw.thumbnail.value,
    };
  } catch (err) {
    console.log(`Unable to retrieve grounds info for ${team}.`);
    return defaultObject;
  }
};

