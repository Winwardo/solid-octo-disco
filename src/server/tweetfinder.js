import { db } from './orientdb';
import { TweetBuilder } from '../shared/data/tweet';
import { TweeterBuilder } from '../shared/data/tweeter';
import { flattenImmutableObject } from '../shared/utilities';

export const exampleDatabaseCall = (response) => {
  const result = [];

  const ttt = db.query('SELECT FROM tweet')
    .then((tweetRecords) => {
      const promises = tweetRecords.map((tweetRecord) => {
        const rid = '' + tweetRecord['@rid'];

        return db.query(
          `SELECT FROM (TRAVERSE in(TWEETED) FROM (SELECT FROM ${rid})) WHERE @class = "Tweeter"`
          )
          .then((tweeterRecords) => {
            const tweeterRecord = tweeterRecords[0];
            const tweet = TweetBuilder()
              .content(tweetRecord.content)
              .tweeter(
                TweeterBuilder()
                  .name(tweeterRecord.name)
                  .handle(tweeterRecord.handle)
                  .build())
              .date(tweetRecord.date.toISOString())
              .build();
            result.push(flattenImmutableObject(tweet));
          });
      });

      Promise.all(promises)
        .then(() => {
          response.end(
            JSON.stringify(
              result));
        });

    });
};
