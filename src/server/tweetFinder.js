import { db } from './orientdb';
import { TweetBuilder, TweeterBuilder } from '../shared/data/databaseObjects';
import { newPromiseChain, flattenImmutableObject } from '../shared/utilities';
import { searchAndSaveFromTwitter } from './twitterSearch';

export const MAX_TWEET_RESULTS = 500;

/**
 * Searches our database for Tweets and returns them.
 * If the returned results are not satisfactory (such
 * as not enough relevant results, or they are too old,)
 * then the Twitter API will be called directly.
 * @param req A HTTP Request object
 * @param res A HTTP Response object
 * @returns {Promise.<T>|*}
 */
export const searchQuery = (req, res) => (
  newPromiseChain()
    .then(() => potentiallySearchTwitter(req.body.searchTwitter, req.body.searchTerms))
    .then(() => Promise.all(req.body.searchTerms.map((queryItem) => searchDatabase(queryItem))))
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

/**
 * May asynchronously search Twitter for new tweet results based on queries.
 * @param {Object} body { searchTwitter: true, searchTerms: ... }
 * @returns {Promise.<T>} Either resolves immediately or a promise for searching Twitter
 */
const potentiallySearchTwitter = (searchTwitter, searchTerms) => {
  if (searchTwitter) {
    const newQuery = buildTwitterQuery(searchTerms);
    return Promise.all(
      searchTerms.map((queryItem) => refreshFromTwitter(queryItem))
    );
  } else {
    return Promise.resolve();
  }
};

/**
 * Given some search terms with param types, convert it to Twitter API
 * friendly queries.
 * @param searchTerms
 * @returns {Array} Some Twitter API queries, like ["#arsenal OR @manchester"]
 */
export const buildTwitterQuery = (searchTerms) => {
  const maxTwitterQueryTerms = 10;
  const joinKeyword = " OR ";

  const result = [];

  let lastQuery = [];
  for (const searchTerm of searchTerms) {
    const actualTerm = searchTerm.query;
    const termWithNoSpaces = actualTerm.replace(' ', '');
    const currentQueryAddition = [];
    let alreadyHadAuthorOrMention = false;

    for (const paramType of searchTerm.paramTypes) {
      switch (paramType.name) {
        case 'keyword':
          currentQueryAddition.push(`"${actualTerm}"`);
          break;
        case 'hashtag':
          currentQueryAddition.push(`#${termWithNoSpaces}`);
          break;
        case 'author':
        case 'mention':
          if (!alreadyHadAuthorOrMention) {
            alreadyHadAuthorOrMention = true;
            currentQueryAddition.push(`@${termWithNoSpaces}`);
          }
          break;
        default:
          break;
      }
    }

    if (lastQuery.length + currentQueryAddition.length <= maxTwitterQueryTerms) {
      lastQuery = lastQuery.concat(currentQueryAddition);
    } else {
      result.push(lastQuery.join(joinKeyword));
      lastQuery = currentQueryAddition;
    }
  }

  if (lastQuery.length > 0) {
    result.push(lastQuery.join(joinKeyword));
  }

  return result;
}

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
    .then(() => Promise.all(
      searchObject.paramTypes
        .filter((paramType) => paramType.selected)
        .map((paramType) => searchByParamType(searchObject, paramType.name))
      )
    )
    .then((searchResults) => searchResults.reduce((previous, current) => previous.concat(current), []))
    .then((tweetRecords) => makeTweets(alreadyAttemptedRefresh, searchObject, tweetRecords))
    .then(
      (resolved) => resolved,
      (rejection) => console.warn('Major error querying the database.', rejection)
    )
);

const searchByParamType = (searchObject, paramType) => {
  switch (paramType) {
    case 'keyword': return searchByKeyword(searchObject.query);
    case 'author': return searchByAuthor(searchObject.query);
    case 'mention': return searchByMention(searchObject.query);
    case 'hashtag': return searchByHashtag(searchObject.query);
  }

  throw(`Invalid paramType for database Tweet searching: '${paramType}'. Should be [author, hashtag, keyword, mention].`);
};

const searchByKeyword = (keyword) => {
  const tweetSelection = makeTweetQuerySelectingFrom(
    'SELECT FROM tweet WHERE content LUCENE :query'
  );
  return db.query(tweetSelection, { params: { query: `${keyword}~`, limit: MAX_TWEET_RESULTS } });
};

const searchByAuthor = (keyword) => {
  const tweetSelection = makeTweetQuerySelectingFrom(
    'TRAVERSE out(\'TWEETED\') FROM (SELECT FROM Tweeter WHERE name LUCENE :query OR handle LUCENE :query)'
  );
  return db.query(tweetSelection, { params: { query: `${keyword}~`, limit: MAX_TWEET_RESULTS } });
};

const searchByMention = (keyword) => {
  const tweetSelection = makeTweetQuerySelectingFrom(
    'TRAVERSE in(\'MENTIONS\') FROM (SELECT FROM Tweeter WHERE name LUCENE :query OR handle LUCENE :query)'
  );
  return db.query(tweetSelection, { params: { query: `${keyword}~`, limit: MAX_TWEET_RESULTS } });
};

const searchByHashtag = (keyword) => {
  const tweetSelection = makeTweetQuerySelectingFrom(
    'TRAVERSE in(\'HAS_HASHTAG\') FROM (SELECT FROM hashtag WHERE content LUCENE :query)'
  );
  return db.query(tweetSelection, { params: { query: `${keyword}~`, limit: MAX_TWEET_RESULTS } });
};

const makeTweetQuerySelectingFrom = (from) => (
  `SELECT `
    + `  *` // All the tweet data
    + `, in('TWEETED').id AS authorId ` // Now the tweet info
    + `, in('TWEETED').name AS authorName `
    + `, in('TWEETED').handle AS authorHandle `
    + `, in('TWEETED').profile_image_url as authorProfileImage `
    + `, in('TWEETED').is_user_mention as isUserMention `
    + ` FROM (${from}) ` // Selected from a subset of tweets
    + ` WHERE @class = 'Tweet' ` // Don't accidentally select authors or hastags etc
    + ` ORDER BY date DESC ` // Might be irrelevant
    + ` UNWIND authorId, authorName, authorHandle, authorProfileImage, isUserMention ` // Converts from ['Steve'] to 'Steve'
    + ` LIMIT :limit ` // Don't select too many results
);

const makeTweets = (alreadyAttemptedRefresh, searchObject, tweetRecords) => (
  tweetRecords.map(tweetRecord => makeTweetAndAuthorFromDatabaseTweetRecord(tweetRecord))
);

const refreshFromTwitter = (searchObject) => (
  searchAndSaveFromTwitter(searchObject.query)
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
    .profile_image_url(record.authorProfileImage)
    .is_user_mention(record.isUserMention)
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
