import http from 'http';
import url from 'url';
import { db } from './orientdb';
import { TweetBuilder } from '../shared/data/tweet';
import { TweeterBuilder } from '../shared/data/tweeter';
import { flattenImmutableObject } from '../shared/utilities';

const port = process.env.PORT || 3000;

const server = http.createServer((request, response) => {
  if (request.method === 'GET') {
    const queryData = url.parse(request.url, true).query;
    response.writeHead(200, { 'Content-Type': 'text/plain' });

    db.query('SELECT FROM tweet WHERE @rid="#14:1"')
      .then((tweetRecords) => {
        for (const tweetRecord of tweetRecords)  {
          const tweeterId = tweetRecord.tweeter;
          console.log('TWEET FINDING')
          console.log('' + tweetRecord['@rid'])


          db.query('TRAVERSE in FROM (SELECT in("TWEETED") from :id)',
            {'params':{'id': tweetRecord['@rid']}}
        )
            .then((tweeterRecord_) => {
              const tweeterRecord = tweeterRecord_[0];
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

          }).error((error) => {
            console.log(error);
            response.end('Failed');
          });
        }
      }).error((error) => {
        console.log(error);
        response.end('Failed');
      });
  }
});

// Listen on port 3000, IP defaults to 127.0.0.1 (localhost)
server.listen(port, () => {
  console.log('Server running at http://localhost: ' + port);
});
