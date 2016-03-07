import { db } from './orientdb';
import { TweetBuilder, TweeterBuilder } from '../shared/data/databaseObjects';
import { chainPromises, flattenImmutableObject } from '../shared/utilities';
import { TwitAccess, searchAndSaveFromTwitter } from './twitterSearch';

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

const buildTweetFromDatabaseRecord = (record) => {
  return TweetBuilder()
    .id(record.id)
    .content(record.content)
    .date(record.date.toISOString())
    .likes(record.likes)
    .retweets(record.retweets)
    .build();
};

export const searchQuery = (req, res, secondary = false) => {
  return doQuery(req.body[0].query)
    .then((data) => {
      res.end(JSON.stringify(data));
    });
}

const refreshFromTwitter = (query) => {
  return searchAndSaveFromTwitter(query)
    .then(() => {
      return doQuery(query, true);
    });
}

const doInnerQuery = (query, secondary) => {
  // First do an initial search of our database for relevant Tweets
  const tweetSelection = 'SELECT FROM tweet WHERE content LUCENE :query ORDER BY date DESC LIMIT 3';

  return chainPromises(() => {
    return db.query(tweetSelection, {'params': {'query': `${query}~`}});
  }).then(
    (tweetRecords) => {
      const shouldRequeryTwitter = !secondary && tweetRecords.length <= 10;
      if (shouldRequeryTwitter) {
        return refreshFromTwitter(query);

      } else {
        return tweetRecords.map((tweetRecord) => {
          return flattenImmutableObject(buildTweetFromDatabaseRecord(tweetRecord));
        });
      }
    },
    (rejection) => {
      console.warn("Major error querying the database.", rejection);
    }
  );
}

const doQuery = (query, secondary = false) => {
  return doInnerQuery(query, secondary)
    .then(
      (STUFF) => {
      //console.log(STUFF);
      return {
        'data': {
          'count': STUFF.length,
          'tweets': STUFF
        }
      }
  })

}
