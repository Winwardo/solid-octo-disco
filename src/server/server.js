import express from 'express';
import webpack from 'webpack';
import config from '../../webpack.config.js';
import { searchQuery } from './tweetFinder';
import { generateDatabase } from './orientdb';
import { searchAndSaveResponse, stream } from './twitterSearch';
var bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

//In development hotload React using webpack-hot-middleware
if (!(process.env.NODE_ENV === 'production')) {
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

app.get('/twit/:query', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  searchAndSaveResponse(res, req.params.query);
});

app.get('/twit/stream/:query', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  stream(req, res);
});

// Listen on port 3000, IP defaults to 127.0.0.1 (localhost)
app.listen(port, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Server running at http://localhost:' + port);
});
