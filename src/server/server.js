import express from 'express';
import { exampleDatabaseCall } from './tweetfinder1';
import { generateDatabase } from './orientdb';
import { searchAndSave } from './twitterSearch';

const app = express();
const port = process.env.PORT || 3000;

app.use('/public', express.static('public'));
app.use('/semantic', express.static('semantic'));

app.get('/orient/generate', (req, res) => {
  generateDatabase(res);
});

app.get('/search/:query', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  exampleDatabaseCall(req, res);
});

app.get('/twit/:query', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  searchAndSave(res, req.params.query);
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
