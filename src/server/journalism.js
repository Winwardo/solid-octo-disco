import { SparqlClient, SPARQL } from 'sparql-client-2';
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

  Promise.all([clubPlayers, clubDescription, groundsDescription])
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
    return rawPlayers;
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
      abstract: clubInfoRaw.abstract,
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
      name: groundsInfoRaw.groundname,
      thumbnail: groundsInfoRaw.thumbnail,
    };
  } catch (err) {
    console.log(`Unable to retrieve grounds info for ${team}.`);
    return defaultObject;
  }
};

export const journalismPlayer = (res, playerName) => {
  const mainDescription = client
    .query(`
      SELECT DISTINCT * WHERE {
        ?player foaf:name "${playerName}"@en .
        {
          ?player a umbel-rc:SoccerPlayer
        } UNION {
          ?player a dbo:SoccerPlayer
        } .

        OPTIONAL { ?player <http://dbpedia.org/property/fullname> ?fullname } .
        OPTIONAL { ?player <http://dbpedia.org/ontology/Person/height> ?height } .
        OPTIONAL { ?player <http://dbpedia.org/ontology/birthDate> ?birthdate } .
        OPTIONAL { ?player <http://dbpedia.org/property/position> ?position . ?position rdfs:label ?positionlabel . FILTER(langMatches(lang(?positionlabel), "EN")) } .
        OPTIONAL { ?player <http://dbpedia.org/property/caps> ?caps } .
        OPTIONAL { ?player <http://dbpedia.org/property/quote> ?quote } .
        OPTIONAL { ?player <http://dbpedia.org/ontology/thumbnail> ?thumbnail } .
        OPTIONAL { ?player <http://dbpedia.org/property/currentclub> ?currentclub . ?currentclub <http://dbpedia.org/property/fullname> ?currentclubname } .

        OPTIONAL { ?player dbo:abstract ?abstract . FILTER(langMatches(lang(?abstract), "EN")) } .
      }
      LIMIT 1
    `)
    .execute();

  const allTeams = client
    .query(`
      SELECT DISTINCT * WHERE {
        ?player foaf:name "${playerName}"@en .
        {
          ?player a umbel-rc:SoccerPlayer
        } UNION {
          ?player a dbo:SoccerPlayer
        } .

        ?player dbo:team ?team .
        ?team rdfs:label ?teamname .
        FILTER(langMatches(lang(?teamname), "EN")) .
      }
    `)
    .execute();

  Promise.all([mainDescription, allTeams])
    .then((result) => {
      try {
        res.end(JSON.stringify({
          description: result[0].results.bindings[0],
          teams: result[1].results.bindings,
        }));
      } catch (err) {

      }
    });
};;
