import { flattenObjectToArray } from './../shared/utilities';

/**
 * Given a list of Tweet objects, return a sorted list of the most frequent words in them
 * @param tweets
 * @returns {Array}
 */
export const mostFrequentWords = (tweets) => {
  return wordCountToSortedList(countWords(tweets));
};;

/**
 * Given a list of Tweet objects, return a sorted list of the most active users,
 * along with their tweets.
 * @param tweets
 * @returns {Array}\
 */
export const mostActiveUsers = (tweets) => {
  const result = flattenObjectToArray(categoriseByUser(tweets));
  result.sort(
    (tweetList1, tweetList2) => {
      return tweetList1.tweets.length < tweetList2.tweets.length;
    }
  );
  return result;
};;

// ---------------------------------------------------------------------------------------

/**
 * Given some list of tweets, create a dictionary of how often each word appears
 * @param tweets An array of Tweet objects
 * @returns {{}} e.g. {'hello': 5, 'world': 8}
 */
function countWords(tweets) {
  const wordCount = {};
  for (const tweet of tweets) {
    for (const word of tweet.content.split(/[ !,.?"']/)) {
      const trimmed = word.trim();
      if (trimmed !== '') {
        // ~~ will convert floats to integer,
        // but importantly quickly convert undefined to 0
        wordCount[trimmed] = ~~wordCount[trimmed] + 1;
      }
    }
  };

  return wordCount;
}

/**
 * Converts some word count object to a list of word/count pairs,
 * sorted from most frequent to least.
 * @param wordCounts An object like {'hello': 5, 'world': 8}
 * @returns {Array} A sorted list of word/count pairs, e.g. [{'word': 'hello', 'count': 5}, ...]
 */
function wordCountToSortedList(wordCounts) {
  const result = [];
  for (let key in wordCounts) {
    if (wordCounts.hasOwnProperty(key)) {
      result.push({
        'word': key,
        'count': wordCounts[key],
      });
    }
  }

  result.sort((wordCount1, wordCount2) => { return wordCount1.count < wordCount2.count; });
  return result;
};

/**
 * Group a bunch of tweets by their Tweeter.
 * @param tweets
 * @returns {{}}
 */
function categoriseByUser(tweets) {
  const tweeterCount = {};

  for (const tweet of tweets) {
    const tweeter = tweet.tweeter;
    if (tweeterCount[tweeter] === undefined) {
      tweeterCount[tweeter] = { 'tweeter': tweeter, 'tweets': [] };
    }

    tweeterCount[tweeter].tweets.push(tweet);
  }

  return tweeterCount;
}
