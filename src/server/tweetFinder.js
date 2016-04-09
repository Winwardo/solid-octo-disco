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
    const twitterQueries = buildTwitterQuery(searchTerms);
    return Promise.all(
      twitterQueries.map((twitterQuery) => searchAndSaveFromTwitter(twitterQuery))
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
  const joinKeyword = ' OR ';

  const result = [];

  let lastQuery = [];
  searchTerms.forEach((searchTerm) => {
    const actualTerm = searchTerm.query;
    const termWithNoSpaces = actualTerm.replace(/ /g, '');
    const currentQueryAddition = [];
    let alreadyHadAuthorOrMention = false;

    searchTerm.paramTypes
      .filter((paramType) => paramType.selected)
      .forEach((paramType) => {
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
    });

    if (lastQuery.length + currentQueryAddition.length <= maxTwitterQueryTerms) {
      lastQuery = lastQuery.concat(currentQueryAddition);
    } else {
      result.push(lastQuery.join(joinKeyword));
      lastQuery = currentQueryAddition;
    }
  });

  if (lastQuery.length > 0) {
    result.push(lastQuery.join(joinKeyword));
  }

  return result;
};

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
  return db.query(tweetSelection, { params: { query: normaliseQueryTerm(keyword), limit: MAX_TWEET_RESULTS } });
};

const searchByAuthor = (author) => {
  const tweetSelection = makeTweetQuerySelectingFrom(
    'TRAVERSE out(\'TWEETED\') FROM (SELECT FROM Tweeter WHERE name LUCENE :query OR handle LUCENE :query)'
  );
  return db.query(tweetSelection, { params: { query: normaliseQueryTerm(author), limit: MAX_TWEET_RESULTS } });
};

const searchByMention = (mention) => {
  const tweetSelection = makeTweetQuerySelectingFrom(
    'TRAVERSE in(\'MENTIONS\') FROM (SELECT FROM Tweeter WHERE name LUCENE :query OR handle LUCENE :query)'
  );
  return db.query(tweetSelection, { params: { query: normaliseQueryTerm(mention), limit: MAX_TWEET_RESULTS } });
};

const searchByHashtag = (hashtag) => {
  const tweetSelection = makeTweetQuerySelectingFrom(
    'TRAVERSE in(\'HAS_HASHTAG\') FROM (SELECT FROM hashtag WHERE content LUCENE :query)'
  );
  return db.query(tweetSelection, { params: { query: normaliseQueryTerm(hashtag), limit: MAX_TWEET_RESULTS } });
};

/**
 * Make a query more search-friendly in our database.
 * Multiple term queries will receive quotes to preserve order
 * e.g. "Manchester United" won't return results for "united manchester"
 * Long single term queries will receive ~ for fuzzy matching
 * @param term Some phrase, like `manchester united`
 * @returns {*} The normalised term.
 */
export const normaliseQueryTerm = (query) => {
  const terms = query.split(' ');

  if (terms.length === 1) {
    if (query.length > 4) {
      return `${query}~`; // fuzzy search
    } else {
      return query;
    }
  } else {
    return `"${query}"`; // add quotes to preserve order
  };
};

const makeTweetQuerySelectingFrom = (from) => (
  `SELECT `
    + '  *' // All the tweet data
    + ', in(\'TWEETED\').id AS authorId ' // Now the tweet info
    + ', in(\'TWEETED\').name AS authorName '
    + ', in(\'TWEETED\').handle AS authorHandle '
    + ', in(\'TWEETED\').profile_image_url as authorProfileImage '
    + ', in(\'TWEETED\').is_user_mention as isUserMention '
    + ` FROM (${from}) ` // Selected from a subset of tweets
    + ' WHERE @class = \'Tweet\' ' // Don't accidentally select authors or hastags etc
    + ' ORDER BY date DESC ' // Might be irrelevant
    + ' UNWIND authorId, authorName, authorHandle, authorProfileImage, isUserMention ' // Converts from ['Steve'] to 'Steve'
    + ' LIMIT :limit ' // Don't select too many results
);

// SELECT *,
// IN(TWEETED).id AS authorId,
// IN(TWEETED).name AS authorName,
// IN(TWEETED).handle AS authorHandle,
// IN(TWEETED).profile_image_url AS authorProfileImage,
// IN(TWEETED).is_user_mention AS IsUserMention
// FROM (SELECT from tweet where id = '718763167116095488')
// WHERE @class = 'Tweet'
// ORDER BY date DESC
// UNWIND authorId, authorName, authorHandle, authorProfileImage, isUserMention
// LIMIT 1

const makeTweets = (alreadyAttemptedRefresh, searchObject, tweetRecords) => (
  tweetRecords.map(tweetRecord => makeTweetAndAuthorFromDatabaseTweetRecord(tweetRecord))
);

const makeTweetAndAuthorFromDatabaseTweetRecord = (tweetRecord) => (
  {
    tweet: flattenImmutableObject(buildTweetFromDatabaseRecord(tweetRecord)),
    author: flattenImmutableObject(buildTweeterFromDatabaseTweetRecord(tweetRecord)),
  }
);

const buildTweeterFromDatabaseTweetRecord = (record) => {
  // will spit out which record couldn't be processed.
  if (!(record.authorId && record.authorName && record.authorHandle && record.authorProfileImage)) {
    console.log('this record is invalid and cannot be processed', record)
  }
  return (
    TweeterBuilder()
      .id(record.authorId)
      .name(record.authorName)
      .handle(record.authorHandle)
      .profile_image_url(record.authorProfileImage)
      .is_user_mention(record.isUserMention)
      .build()
  );
};

const buildTweetFromDatabaseRecord = (record) => (
  TweetBuilder()
    .id(record.id)
    .content(record.content)
    .date(record.date.toISOString())
    .likes(record.likes)
    .retweets(record.retweets)
    .longitude(record.longitude)
    .latitude(record.latitude)
    .contains_a_quoted_tweet(record.contains_a_quoted_tweet)
    .build()
);

const getTweetsAsResults = (data) => (
  data.map(
    (tweet) => ({ data: tweet.tweet, author: tweet.author, source: 'twitter' })
  )
);

export const getTweetFromDb = (res, id) => (
  newPromiseChain()
    .then(() => (
       db.query(
         makeTweetQuerySelectingFrom('SELECT FROM tweet WHERE id =:id'), { params: { id, limit: 1 }, }
       )
    ))
    .then((results) => makeTweetAndAuthorFromDatabaseTweetRecord(results[0]))
    .then(
      (response) => res.status(200).end(JSON.stringify(response)),
      (rej) => res.status(500).end(
        JSON.stringify({
          message: 'Unable to get tweet from the database.',
          reason: rej,
        })
      )
    )
);
