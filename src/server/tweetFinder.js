import { db } from './orientdb';
import { TweetBuilder, TweeterBuilder } from '../shared/data/databaseObjects';
import { chainPromises, flattenImmutableObject } from '../shared/utilities';
import { TwitAccess, searchAndSaveFromTwitter } from './twitterSearch';

/**
 * Searches our database for Tweets and returns them.
 * If our search is not good enough, access Twitter directly to retrieve more tweets.
 * @param req A HTTP Request object
 * @param res A HTTP Response object
 * @returns {Promise.<T>|*}
 */
export const searchQuery = (req, res) => {
  const query = req.body[0].query;
  return searchAndCollateResults(query)
    .then(
      (data) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      },

      (rejection) => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end('An unexpected internal error occurred.');
        console.warn(`Unable to search for query '${query}'`, rejection);
      }
    );
};

const searchAndCollateResults = (query) => {
  return searchDatabase(query)
    .then((data) => {
      return {
        'data': {
          'count': data.length,
          'records': getTweetsAsResults(data),
        },
      };
    });
};

const searchDatabase = (query, alreadyAttemptedRefresh = false) => {
  const tweetSelection = 'SELECT FROM tweet WHERE content LUCENE :query ORDER BY date DESC LIMIT 300';

  return chainPromises(() => {
    return db.query(tweetSelection, { 'params': { 'query': `${query}~` } });
  }).then(
    (tweetRecords) => {
      const shouldRequeryTwitter = false && !alreadyAttemptedRefresh && tweetRecords.length <= 20;
      if (shouldRequeryTwitter) {
        return refreshFromTwitter(query);

      } else {
        return tweetRecords.map((tweetRecord) => {
          return flattenImmutableObject(buildTweetFromDatabaseRecord(tweetRecord));
        });
      }
    },

    (rejection) => {
      console.warn('Major error querying the database.', rejection);
    }
  );
};

const refreshFromTwitter = (query) => {
  return searchAndSaveFromTwitter(query)
    .then(() => {
      return searchDatabase(query, true);
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

const getTweetsAsResults = (data) => {
  return data.map((tweet) => { return { 'data': tweet, 'author': {}, 'source': 'twitter' }; });
};
