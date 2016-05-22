import { SparqlClient } from 'sparql-client-2';
import moment from 'moment';
import { newPromiseChain } from '../shared/utilities';
import { fetchFromFootballAPI } from './footballSearch';

const client =
  new SparqlClient('http://dbpedia.org/sparql')
    .register({
      db: 'http://dbpedia.org/resource/',
      dbpedia: 'http://dbpedia.org/property/',
    });

export const journalismTeam = (res, team, footballDataOrgTeamId) =>
  newPromiseChain()
    .then(() => fetchFromFootballAPI(`http://api.football-data.org/v1/teams/${footballDataOrgTeamId}/fixtures`))
    .then((data) => ({ footballApiData: data }))
    .then((all) =>
      newPromiseChain()
        .then(() => getTeamInformation(team))
        .then((teamInformation) => ({ ...all, leftTeam: teamInformation }))
    ).then((all) =>
      Promise.all(
        all.footballApiData.fixtures.filter(fixture => {
          const fixtureMonthDifferenceFromToday = moment().diff(moment(fixture.date), 'months');
          return fixtureMonthDifferenceFromToday <= 1 && fixtureMonthDifferenceFromToday >= -1;
        }).reverse().map(
          (fixture) => {
            let otherTeamName;
            let searchedTeamIsHome;
            if (fixture.homeTeamName === team) {
              otherTeamName = fixture.awayTeamName;
              searchedTeamIsHome = true;
            } else if (fixture.awayTeamName === team) {
              otherTeamName = fixture.homeTeamName;
              searchedTeamIsHome = false;
            } else {
              throw (`Neither home nor away team matches the given team name ${team}.`);
            }

            return getTeamInformation(otherTeamName).then((result) => (
              {
                leftTeam: all.leftTeam,
                rightTeam: result,
                fixtureInfo: fixture,
                searchedTeamIsHome,
              }
            ));
          }
        )
      ).then((data) => ({ ...all, matches: data }))
    ).then((all) => ({ matches: all.matches }))
    .then((all) => res.end(JSON.stringify(all)));

const getTeamInformation = (teamOriginal) => {
  const team = teamOriginal.replace(/ /g, '_');

  const clubDescription = client
    .registerCommon('rdfs')
    .query(`
      SELECT * WHERE {
        dbr:${team} <http://dbpedia.org/ontology/wikiPageRedirects> ?team .
        ?team a <http://dbpedia.org/ontology/SoccerClub> .
        OPTIONAL { ?team <http://dbpedia.org/ontology/abstract> ?abstract } .
        OPTIONAL { ?team <http://dbpedia.org/property/nickname> ?nickname } .
        OPTIONAL { ?team <http://dbpedia.org/property/website> ?website } .
        OPTIONAL { ?team <http://dbpedia.org/ontology/league> ?league . ?league rdfs:label ?label } .

        FILTER(langMatches(lang(?abstract), "EN")) .
        FILTER(langMatches(lang(?label), "EN")) .
      }
    `)
    .execute();

  const groundsDescription = client
    .query(`
        SELECT * WHERE {
          dbr:${team} <http://dbpedia.org/ontology/wikiPageRedirects> ?team .
          ?team a <http://dbpedia.org/ontology/SoccerClub> .
          OPTIONAL {
            ?team <http://dbpedia.org/ontology/ground> ?grounds .
            OPTIONAL { ?grounds <http://dbpedia.org/property/name> ?groundname } .
            OPTIONAL { ?grounds <http://dbpedia.org/ontology/seatingCapacity> ?capacity } .
            OPTIONAL { ?grounds <http://dbpedia.org/ontology/thumbnail> ?thumbnail } .
            FILTER(langMatches(lang(?groundname), "EN")) .
          } .
        }
      `)
    .execute();

  const clubPlayers = client
    .registerCommon('rdfs')
    .query(`
      SELECT * WHERE {
        dbr:${team} <http://dbpedia.org/ontology/wikiPageRedirects> ?team .
        ?team a <http://dbpedia.org/ontology/SoccerClub> .
        OPTIONAL {
          ?player <http://dbpedia.org/property/currentclub> ?team .
          OPTIONAL { ?player <http://dbpedia.org/property/fullname> ?name } .
          OPTIONAL { ?player <http://dbpedia.org/ontology/number> ?number } .
          OPTIONAL { ?player <http://dbpedia.org/ontology/birthDate> ?birthDate } .
          OPTIONAL { ?player <http://dbpedia.org/ontology/position> ?position . ?position rdfs:label ?positionLabel } .
        }

        FILTER(langMatches(lang(?positionLabel), "EN")) .
      }
    `)
    .execute();

  const chairmanDescription = client
    .registerCommon('rdfs')
    .query(`
      SELECT * WHERE {
        dbr:${team} <http://dbpedia.org/ontology/wikiPageRedirects> ?team .
        ?team a <http://dbpedia.org/ontology/SoccerClub> .
        OPTIONAL {
          ?team <http://dbpedia.org/ontology/chairman> ?chairman .
          OPTIONAL { ?chairman <http://dbpedia.org/property/name> ?name } .
          OPTIONAL { ?chairman <http://dbpedia.org/ontology/birthDate> ?birthDate } .
          OPTIONAL { ?chairman rdfs:comment ?comment } .
          OPTIONAL { ?chairman <http://dbpedia.org/ontology/thumbnail> ?thumbnail } .
        } .

        FILTER(langMatches(lang(?name), "EN")) .
        FILTER(langMatches(lang(?comment), "EN")) .
      }
    `)
    .execute();

  const managerDescription = client
    .registerCommon('rdfs')
    .query(`
      SELECT * WHERE {
        dbr:${team} <http://dbpedia.org/ontology/wikiPageRedirects> ?team .
        ?team a <http://dbpedia.org/ontology/SoccerClub> .
        OPTIONAL {
          ?team <http://dbpedia.org/ontology/manager> ?manager
          OPTIONAL { ?manager <http://dbpedia.org/property/fullname> ?name } .
          OPTIONAL { ?manager <http://dbpedia.org/ontology/birthDate> ?birthDate } .
          OPTIONAL { ?manager rdfs:comment ?comment } .
          OPTIONAL { ?manager <http://dbpedia.org/ontology/thumbnail> ?thumbnail } .
        } .

        FILTER(langMatches(lang(?name), "EN")) .
        FILTER(langMatches(lang(?comment), "EN")) .
      }
    `)
    .execute();

  const ListOfleaguesWon = client
    .registerCommon('rdfs')
    .query(`
      SELECT ?winners ?label WHERE {
        dbr:${team} <http://dbpedia.org/ontology/wikiPageRedirects> ?team .
        ?team a <http://dbpedia.org/ontology/SoccerClub> .
        OPTIONAL { ?winners <http://dbpedia.org/property/winners> ?team . ?winners rdfs:label ?label } .
        FILTER(langMatches(lang(?label), "EN")) .
      }
    `)
    .execute();

  return Promise.all([
    clubDescription, groundsDescription, clubPlayers, chairmanDescription, managerDescription, ListOfleaguesWon
  ])
    .then(
      results => {
        const clubInfo = results[0].results.bindings[0];
        const groundsInfo = results[1].results.bindings[0];
        const players = results[2].results.bindings;
        const chairman = results[3].results.bindings;
        const manager = results[4].results.bindings;
        const leaguesWon = results[5].results.bindings;

        return {
          team: teamOriginal, clubInfo, groundsInfo, players, chairman, manager, leaguesWon
        };
      }
    );
};

export const journalismPlayer = (res, playerName) => {
  const mainDescription = client
    .registerCommon('rdfs')
    .query(`
      SELECT DISTINCT * WHERE {
        ?player foaf:name "${playerName}"@en .
        {
          ?player a umbel-rc:SoccerPlayer
        } UNION {
          ?player a dbo:SoccerPlayer
        } .

        OPTIONAL { ?player <http://dbpedia.org/property/fullname> ?fullname } .
        OPTIONAL { ?player <http://dbpedia.org/property/name> ?name } .
        OPTIONAL { ?player <http://dbpedia.org/ontology/Person/height> ?height } .
        OPTIONAL { ?player <http://dbpedia.org/ontology/birthDate> ?birthdate } .
        OPTIONAL { ?player <http://dbpedia.org/property/position> ?position . ?position rdfs:label ?positionlabel . FILTER(langMatches(lang(?positionlabel), "EN")) } .
        OPTIONAL { ?player <http://dbpedia.org/property/caps> ?caps } .
        OPTIONAL { ?player <http://dbpedia.org/property/goals> ?goals } .
        OPTIONAL { ?player <http://dbpedia.org/property/quote> ?quote } .
        OPTIONAL { ?player <http://dbpedia.org/ontology/thumbnail> ?thumbnail } .
        OPTIONAL {
          ?player <http://dbpedia.org/property/currentclub> ?currentclub .
          ?currentclub <http://dbpedia.org/property/fullname> ?currentclubname .
        }

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

        OPTIONAL {
          ?team rdfs:comment ?teamcomment .
          FILTER(langMatches(lang(?teamcomment), "EN")) .
        } .

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
};
