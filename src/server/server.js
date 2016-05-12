import express from 'express';
import config from '../../webpack.config.js';
import { searchQuery, getTweetFromDb } from './tweetFinder';
import { generateDatabase } from './orientdb';
import { stream, TwitAccess } from './twitterSearch';
import bodyParser from 'body-parser';
import {
  searchFootballSeasons, searchFootballSeasonTeams, searchFootballTeamPlayers
} from './footballSearch';
const {SparqlClient, SPARQL} = require('sparql-client-2');


const app = express();
const port = process.env.PORT || 3000;

// In development hotload React using webpack-hot-middleware
if ((process.env.NODE_ENV === 'development')) {
  const webpack = require('webpack');
  const compiler = webpack(config[1]);
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config[1].output.publicPath,
  }));

  app.use(require('webpack-hot-middleware')(compiler));
}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//--------------------------------------------------------------------------

app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.get('/orient/generate', (req, res) => {
  generateDatabase(res);
});

app.post('/search', (req, res) => {
  searchQuery(req, res);
});

app.get('/tweet/:id', (req, res) => {
  getTweetFromDb(res, req.params.id);
});

// not used in Socto web interface, example test if we could stream
app.get('/twit/stream/:query', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  stream(req, res);
});

app.get('/football/seasons/:year', (req, res) => {
  searchFootballSeasons(res, req.params.year);
});

app.post('/football/seasons/:year/teams', (req, res) => {
  searchFootballSeasonTeams(res, req.params.year, req.body.leagues);
});

app.get('/football/teams/:teamid/players', (req, res) => {
  searchFootballTeamPlayers(res, req.params.teamid);
});

app.get('/journalism/teams/:teamname', (req, res) => {
  const team = req.params.teamname;

  const client =
    new SparqlClient('http://dbpedia.org/sparql')
      .register({
        db: 'http://dbpedia.org/resource/',
        dbpedia: 'http://dbpedia.org/property/'
      });

  const cityName = 'Vienna';

  const clubPlayers = client
    .query(SPARQL`
      SELECT * WHERE {
        ${{dbr: team}} <http://dbpedia.org/ontology/wikiPageRedirects> ?team .
        ?team a <http://dbpedia.org/ontology/SoccerClub> .
        ?player dbp:currentclub ?team .
        ?player dbp:fullname ?name
      }
    `)
    .execute();

  const clubDescription = client
    .query(SPARQL`
      SELECT * WHERE {
        ${{dbr: team}} <http://dbpedia.org/ontology/wikiPageRedirects> ?team .
        ?team a <http://dbpedia.org/ontology/SoccerClub> .
        ?team dbo:abstract ?abstract .
        FILTER(langMatches(lang(?abstract), "EN"))
      }
    `)
    .execute();

  const groundsDescription = client
      .query(SPARQL`
        SELECT * WHERE {
          ${{dbr: team}} <http://dbpedia.org/ontology/wikiPageRedirects> ?team .
          ?team a <http://dbpedia.org/ontology/SoccerClub> .
          ?team dbo:ground ?grounds .
            ?grounds dbp:name ?groundname .
            ?grounds dbo:thumbnail ?thumbnail

            FILTER(langMatches(lang(?groundname), "EN"))
        }
      `)
      .execute();

  Promise.all([clubPlayers, clubDescription, groundsDescription])
    .then(thing => {
        console.log(thing.length)

        let players = [];
        try {
          players = thing[0].results.bindings.map((player) => {return {
              name: player.name.value,
              source: player.player.value,
            }});
        } catch (err) { }

        let clubInfo = {};
        try {
          const clubInfoRaw = thing[1].results.bindings[0]
          clubInfo = {abstract: clubInfoRaw.abstract.value}
        } catch (err) { }

        let groundsInfo = {}
        try {
          const groundsInfoRaw = thing[2].results.bindings[0]
          groundsInfo = {
            name: groundsInfoRaw.groundname.value,
            thumbnail: groundsInfoRaw.thumbnail.value,
          }
        } catch (err) { }

        //console.log(thing);
        res.end(JSON.stringify({players, clubInfo, groundsInfo}));
      },
      rej => {
        console.log("fail")
        console.log(rej)
        res.end("poop")
      }
    );



  //console.log("hey", team);
  //const client = new sparql.Client('http://dbpedia.org/sparql');
  //
  //
  //const query = 'SELECT * WHERE { ' +
  //  'dbr:' + team + '<http://dbpedia.org/ontology/wikiPageRedirects> ?team . ' +
  //  '?team a <http://dbpedia.org/ontology/SoccerClub> . ' +
  //  '?player dbp:currentclub ?team . ' +
  //  '?player dbp:fullname ?name ' +
  //  '}';
  //client.query(query, (err, response) => {
  //  console.log(response);
  //  res.end(JSON.stringify(response));
  //});
});

// Used for development purposes to make sure we're hitting the correct twitter end point
app.get('/exampleTwitterJson', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  TwitAccess.get('statuses/show/:id', { id: '718691141239975936' }) //718691141239975936, 717000298338750465, 693770454784425984, 718691141239975936
    .then(tweets => res.end(JSON.stringify(tweets.data.user)));
});

app.get('*', (req, res) => {
  res.status(404).sendFile('404.html', { root: 'public' });
});

// Listen on port 3000, IP defaults to 127.0.0.1 (localhost)
app.listen(port, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`Server running at http://localhost:${port}`);
});
