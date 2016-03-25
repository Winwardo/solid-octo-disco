import { db } from './orientdb';
import { TweetBuilder, TweeterBuilder } from '../shared/data/databaseObjects';
import { newPromiseChain, flattenImmutableObject } from '../shared/utilities';
import { searchAndSaveFromTwitter } from './twitterSearch';

/**
 * Searches our database for Tweets and returns them.
 * If our search is not good enough, access Twitter directly to retrieve more tweets.
 * @param req A HTTP Request object
 * @param res A HTTP Response object
 * @returns {Promise.<T>|*}
 */
export const searchQuery = (req, res) => (
  newPromiseChain()
    .then(() => Promise.all(req.body.map((queryItem) => searchDatabase(queryItem))))
    .then((tweetResultsForAllQueries) => splatTogether(tweetResultsForAllQueries, 'OR'))
    .then((splattedTweets) => getTweetsAsResults(splattedTweets))
    .then((tweetsAsResults) => resultsToPresentableOutput(tweetsAsResults))
    .then(
      (presentableTweets) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(presentableTweets));
      },
      (rejection) => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end('An unexpected internal error occurred.');
        console.warn(`Unable to search for query '${query}'`, rejection);
      }
    )
);

const splatTogether = (allTweetResults, type) => {
  if (type === 'OR') {
    return unionTweets(allTweetResults);
  } else {
    throw(`Undefined splatting of type ${type} occurred. Type should be 'AND' or 'OR'.`);
  }
};

/**
 * Given a list of resultLists, union all the Tweets together.
 * That is, given the following list of Tweet ids:
 *  [[1,2], [2, 3], [1, 4, 5]]
 * return
 *  [1,2,3,4,5]
 * @param {Array[]} allTweetResults - A list of Tweet result lists.
 * @return {[tweetDatas]} A list of unique Tweets
 */
export const unionTweets = (allTweetResults) => {
  const dict = {};

  // Create a dictionary of all Tweets, effectively cancelling out any duplicates
  allTweetResults.forEach((tweetList) =>
    tweetList.forEach((tweetData) =>
      dict[tweetData.tweet.id] = tweetData
    )
  );

  const union = [];
  for (const key in dict) {
    union.push(dict[key]);
  }

  return union;
};

const resultsToPresentableOutput = (results) => (
  {
    data: {
      count: results.length,
      records: results,
    },
  }
);

const searchDatabase = (searchObject, alreadyAttemptedRefresh = false) => (
  newPromiseChain()
    .then(() => Promise.all([searchByParamType(searchObject, 'keyword')]))
    .then((searchResults) => searchResults.reduce((previous, current) => previous.concat(current)))
    .then((tweetRecords) => refreshFromTwitterOrMakeTweets(alreadyAttemptedRefresh, searchObject, tweetRecords))
    .then(
      (resolved) => resolved,
      (rejection) => console.warn('Major error querying the database.', rejection)
    )
)

const searchByParamType = (searchObject, paramType) => {
  switch (paramType) {
    case 'keyword': return searchByKeyword(searchObject.query);
  }

  throw(`Invalid paramType for database Tweet searching: '${paramType}'. Should be [author, hashtag, keyword, mention].`);
}

const searchByKeyword = (keyword) => {
  console.log("sbkw", keyword);
  const tweetSelection = 'SELECT *, in(\'TWEETED\').id AS authorId, in(\'TWEETED\').name AS authorName, in(\'TWEETED\').handle AS authorHandle FROM tweet WHERE content LUCENE :query ORDER BY date DESC UNWIND authorId, authorName, authorHandle LIMIT :limit';
  return db.query(tweetSelection, { params: { query: `${keyword}~`, limit: 300 } });
}

const refreshFromTwitterOrMakeTweets = (alreadyAttemptedRefresh, searchObject, tweetRecords) => {
  const shouldRequeryTwitter = !alreadyAttemptedRefresh && tweetRecords.length <= 20;
  if (shouldRequeryTwitter) {
    return refreshFromTwitter(searchObject);
  } else {
    return tweetRecords.map(tweetRecord => makeTweetAndAuthorFromDatabaseTweetRecord(tweetRecord));
  }
};

const refreshFromTwitter = (searchObject) => (
  searchAndSaveFromTwitter(searchObject.query)
    .then(() => searchDatabase(searchObject, true))
);

const makeTweetAndAuthorFromDatabaseTweetRecord = (tweetRecord) => (
  {
    tweet: flattenImmutableObject(buildTweetFromDatabaseRecord(tweetRecord)),
    author: flattenImmutableObject(buildTweeterFromDatabaseTweetRecord(tweetRecord)),
  }
);

const buildTweeterFromDatabaseTweetRecord = (record) => (
  TweeterBuilder()
    .id(record.authorId)
    .name(record.authorName)
    .handle(record.authorHandle)
    .build()
);

const buildTweetFromDatabaseRecord = (record) => (
  TweetBuilder()
    .id(record.id)
    .content(record.content)
    .date(record.date.toISOString())
    .likes(record.likes)
    .retweets(record.retweets)
    .longitude(record.longitude)
    .latitude(record.latitude)
    .build()
);

const getTweetsAsResults = (data) => (
  data.map(
    (tweet) => ({ data: tweet.tweet, author: tweet.author, source: 'twitter' })
  )
);
