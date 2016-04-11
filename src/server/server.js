import express from 'express';
import config from '../../webpack.config.js';
import { searchQuery, getTweetFromDb } from './tweetFinder';
import { generateDatabase } from './orientdb';
import { stream, TwitAccess } from './twitterSearch';
import bodyParser from 'body-parser';
import {
  searchFootballSeasons, searchFootballSeasonTeams, searchFootballTeamPlayers
} from './footballSearch';

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

// Used for development purposes to make sure we're hitting the correct twitter end point
app.get('/exampleTwitterJson', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  TwitAccess.get('statuses/show/:id', { id: '719459903606276096' }) //718691141239975936, 717000298338750465, 693770454784425984, 718691141239975936
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
