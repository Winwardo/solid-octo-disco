import { db } from './orientdb';
import { TweetBuilder, TweeterBuilder } from '../shared/data/databaseObjects';
import { flattenImmutableObject } from '../shared/utilities';

/**
 * Grab all tweets from the database, and show them with their authors.
 * @deprecated
 * @param response
 */
export const exampleDatabaseCall = (request, response) => {
  db.query('SELECT FROM tweet WHERE content LUCENE :query LIMIT 20',
    {
      'params': {
        'query': request.params.query + '~',
      },
    })
    .then((tweetRecords) => {
      const result = [];

      const promises = tweetRecords.map((tweetRecord) => {
        const rid = '' + tweetRecord['@rid'];

        return db.query(
          `SELECT FROM (TRAVERSE in(TWEETED) FROM (SELECT FROM ${rid})) WHERE @class = "Tweeter"`
          )
          .then((tweeterRecords) => {
            const tweeterRecord = tweeterRecords[0];
            const toReturn = {
              'tweet':
                flattenImmutableObject(
                  TweetBuilder()
                    .id(tweetRecord.id)
                  .content(tweetRecord.content)
                  .date(tweetRecord.date.toISOString())
                  .likes(tweetRecord.likes)
                  .retweets(tweeterRecord.retweets)
                  .build()),
              'tweeter':
                flattenImmutableObject(
                  TweeterBuilder()
                    .id(tweeterRecord.id)
                  .name(tweeterRecord.name)
                  .handle(tweeterRecord.handle)
                  .build()),
            };

            result.push(toReturn);
          });
      });

      Promise.all(promises)
        .then(() => {
          response.end(
            JSON.stringify(
              result));
        });

    })
    .error((error) => {
      console.error('Major issues abound.');
      response.end('Unable to connect to database.');
    });
};
