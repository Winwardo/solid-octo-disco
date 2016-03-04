import express from 'express';
import path from 'path';
import webpack from 'webpack';
import clientConfig from '../../webpack.config.js'

const app = express();
const port = process.env.PORT || 3000;

console.log(clientConfig[1]);
//In development hotload React using webpack-hot-middleware
if (!(process.env.NODE_ENV === 'production')){
	const compiler = webpack(clientConfig[1]);

	app.use(require('webpack-dev-middleware')(compiler, {
	  noInfo: true,
	  publicPath: clientConfig[1].output.publicPath
	}));

	app.use(require('webpack-hot-middleware')(compiler));
}
//--------------------------------------------------------------------------

app.use('/public', express.static('public'));

app.get('*', (req, res) => {
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
