import express from 'express';
import path from 'path';
import { db } from './orientdb';
import { TweetBuilder } from '../shared/data/tweet';
import { TweeterBuilder } from '../shared/data/tweeter';
import { flattenImmutableObject } from '../shared/utilities';

const app = express();
const port = process.env.PORT || 3000;

app.use('/public', express.static('public'));

app.get('/orient', (req, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });

  db.query('SELECT * FROM (TRAVERSE in("TWEETED") FROM #14:0)')
    .then((tweetRecords) => {
        const tweetRecord = tweetRecords[0];
      const tweeterRecord = tweetRecords[1];

        console.log("THEN")
        console.log(tweeterRecord)
        console.log(tweeterRecord.name)

        const tweet = TweetBuilder()
          .content(tweetRecord.content)
          .tweeter(
            TweeterBuilder()
              .name(tweeterRecord.name)
              .handle(tweeterRecord.handle)
              .build())
          .date(tweetRecord.date.toISOString())
          .build();

        console.log(tweet.content(), tweet.tweeter().name())

        response.end(
          JSON.stringify(
            flattenImmutableObject(
              tweet)));

        //const tweeterId = tweetRecord.tweeter;
        //console.log('TWEET FINDING')
        //console.log('' + tweetRecord['@rid'])



        //db.query('TRAVERSE in FROM (SELECT in("TWEETED") from :id)',
        //  {'params':{'id': tweetRecord['@rid']}}
        //  )

        //
        //  }).error((error) => {
        //  console.log(error);
        //  response.end('Failed');
        //});
      //}
    }).error((error) => {
    console.log(error);
    response.end('Failed');
  });
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
