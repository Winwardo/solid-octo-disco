'use strict';

module.exports = {
  /**
   * Given a list of Tweet objects, return a sorted list of the most frequent words in them
   * @param tweets
   * @returns {Array}
   */
  mostFrequentWords: function (tweets) {
    const wordCounts = countWords(tweets);
    return wordCountToSortedList(wordCounts);
  },

  /**
   * Given a list of Tweet objects, return a sorted list of the most active users,
   * along with their tweets.
   * @param tweets
   * @returns {Array}
   */
  mostActiveUsers: function (tweets) {
    const tweeterCount = categoriseByUser(tweets);
    return flattenObjectToArray(tweeterCount);
  },
};

// ---------------------------------------------------------------------------------------

/**
 * Given some list of tweets, create a dictionary of how often each word appears
 * @param tweets An array of Tweet objects
 * @returns {{}} e.g. {'hello': 5, 'world': 8}
 */
function countWords(tweets) {
  const wordCount = {};
  for (let tweet of tweets) {
    for (let word of tweet.content.split(/[ !,.?"']/)) {
      word = word.trim();
      if (word === '') { continue; }

      // ~~ will convert floats to integer,
      // but importantly quickly convert undefined to 0
      wordCount[word] = ~~wordCount[word] + 1;
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
  let result = [];
  for (let key in wordCounts) {
    if (wordCounts.hasOwnProperty(key)) {
      result.push({
        'word': key,
        'count': wordCounts[key],
      });
    }
  }

  result.sort((a, b) => { return a.count < b.count; });
  return result;
};

/**
 * Group a bunch of tweets by their Tweeter.
 * @param tweets
 * @returns {{}}
 */
function categoriseByUser(tweets) {
  let tweeterCount = {};

  for (let tweet of tweets) {
    const tweeter = tweet.tweeter;
    if (tweeterCount[tweeter] === undefined) {
      tweeterCount[tweeter] = { 'tweeter': tweeter, 'tweets': [] };
    }

    tweeterCount[tweeter].tweets.push(tweet);
  }

  return tweeterCount;
}

/**
 * Converts an object of style {'a': {'b': c}, 'd': {'e': f}} to [{'b': c}, {'e': f}]
 * @param givenObject
 * @returns {Array}
 */
function flattenObjectToArray(givenObject) {
  let result = [];
  for (let key in givenObject) {
    if (givenObject.hasOwnProperty(key)) {
      result.push(givenObject[key]);
    }
  }

  return result;
}
