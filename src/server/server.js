import express from 'express';
import { exampleDatabaseCall } from './tweetfinder';
import { generateDatabase } from './orientdb';
import { test } from './twitterSearch'

const app = express();
const port = process.env.PORT || 3000;

app.use('/public', express.static('public'));
app.use('/semantic', express.static('semantic'));

app.get('/orient/generate', (req, res) => {
  generateDatabase(res);
});

app.get('/orient', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  exampleDatabaseCall(res);
});

app.get('/twit', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  test(res);
})

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
