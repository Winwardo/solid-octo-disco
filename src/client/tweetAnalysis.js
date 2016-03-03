'use strict';

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

module.exports = {
  /**
   * Given a list of Tweet objects, return a sorted list of the most frequent words in them
   * @param tweets
   * @returns {*}
   */
  mostFrequentWords: function (tweets) {
    const wordCounts = countWords(tweets);
    return wordCountToSortedList(wordCounts);
  },
};
