import { db } from './orientdb';
import { TweetBuilder, TweeterBuilder } from '../shared/data/databaseObjects';
import { chainPromises, flattenImmutableObject } from '../shared/utilities';
import { TwitAccess, searchAndSaveFromTwitter } from './twitterSearch';

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
  const query = req.body[0].query;
  return doQuery(query)
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
};;

const refreshFromTwitter = (query) => {
  return searchAndSaveFromTwitter(query)
    .then(() => {
      return doInnerQuery(query, true);
    });
};

const doInnerQuery = (query, alreadyAttemptedRefresh) => {
  // First do an initial search of our database for relevant Tweets
  const tweetSelection = 'SELECT FROM tweet WHERE content LUCENE :query ORDER BY date DESC LIMIT 300';

  return chainPromises(() => {
    return db.query(tweetSelection, { 'params': { 'query': `${query}~` } });
  }).then(
    (tweetRecords) => {
      const shouldRequeryTwitter = !alreadyAttemptedRefresh && tweetRecords.length <= 10;
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

const doQuery = (query, secondary = false) => {
  return doInnerQuery(query, secondary)
    .then((data) => {
      return {
        'data': {
          'count': data.length,
          'records':
            data.map((tweet) => { return { 'content': tweet, 'source': 'twitter' }; }),
        },
      };
    });

};
