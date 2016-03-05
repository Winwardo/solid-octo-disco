import express from 'express';
import webpack from 'webpack';
import config from '../../webpack.config.js';
import { exampleDatabaseCall } from './tweetfinder';
import { generateDatabase } from './orientdb';

const app = express();
const port = process.env.PORT || 3000;

//In development hotload React using webpack-hot-middleware
if (!(process.env.NODE_ENV === 'production')){
	const compiler = webpack(config[1]);
	app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
	  publicPath: config[1].output.publicPath
	}));

	app.use(require('webpack-hot-middleware')(compiler, {
    log: console.log
  }));
}
//--------------------------------------------------------------------------

app.use('/public', express.static('public'));

app.get('/orient/generate', (req, res) => {
  generateDatabase(res);
});

app.get('/orient', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  exampleDatabaseCall(res);
});

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Listen on port 3000, IP defaults to 127.0.0.1 (localhost)
app.listen(port, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Server running at http://localhost: ' + port);
});
