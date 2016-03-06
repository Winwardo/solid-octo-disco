import { flattenObjectToArray } from './../shared/utilities';

/**
 * Given a list of Tweet objects, return a sorted list of the most frequent words in them
 * @param tweets
 * @returns {Array}
 */
export const mostFrequentWords = (tweets) => {
  return wordCountToSortedList(countWords(tweets));
};

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

export const exampleTweets = [{"tweet":{"id":706525663755264000,"content":"SIDEMEN GIANT FOOTBALL CHALLENGE! https://t.co/9B1YNc9k6e","date":"2016-03-06T17:03:39.000Z","likes":0},"tweeter":{"id":3287919378,"name":"Anna â˜… [SDMN]","handle":"AnnaJoyce_15"}},{"tweet":{"id":706518094450135000,"content":"Crystal Palace Football Club https://t.co/DTD8gwMZjm","date":"2016-03-06T16:33:34.000Z","likes":0},"tweeter":{"id":62586199,"name":"maxwell","handle":"MaxC25"}},{"tweet":{"id":706522750572175400,"content":"Whenever I watch football in Hamburg I got the smell of weed coming my way.., are all football fans in this city members of the Green Party?","date":"2016-03-06T16:52:04.000Z","likes":0},"tweeter":{"id":246151676,"name":"Norwegian Musings","handle":"normusings"}},{"tweet":{"id":706525993855545300,"content":"Fluminense Switch to DryWorld. 2016 Kits Revealed. https://t.co/FTwbjpFxAf FOOTBALL https://t.co/QgnJT4Sp4p","date":"2016-03-06T17:04:58.000Z","likes":0},"tweeter":{"id":1060055503,"name":"soccernews_2013","handle":"soccernews_2013"}},{"tweet":{"id":706505553275658200,"content":"The drought is over...\n\nLionel Messi scores his first goal in 60 minutes of football. https://t.co/Eop2wxmsWQ","date":"2016-03-06T15:43:44.000Z","likes":0},"tweeter":{"id":221769011,"name":"bet365","handle":"bet365"}},{"tweet":{"id":706496134848446500,"content":"I support #MarcoRubio No one quits football during the 2nd quarter! GO #MarcoRubio #FloridaPrimary https://t.co/OfQAub9vs6","date":"2016-03-06T15:06:19.000Z","likes":0},"tweeter":{"id":3047952655,"name":"JaneAnn","handle":"masterscreek"}},{"tweet":{"id":706526000834867200,"content":"@Espngreeny More times than not, DEFENSE wins in playoffs. Until this year, Manning's teams never had a great defense...Football=team game.","date":"2016-03-06T17:04:59.000Z","likes":0},"tweeter":{"id":24758898,"name":"David Grim","handle":"davidgrim22"}},{"tweet":{"id":706514728516866000,"content":"Multiple titles. Multiple records. And one super finale.\n\nPeyton Manning's football legacy: https://t.co/0WlB8SGyQX https://t.co/veVfMuGV5n","date":"2016-03-06T16:20:12.000Z","likes":0},"tweeter":{"id":439848268,"name":"Marshall Byers","handle":"MackinMarshall"}},{"tweet":{"id":706522412087648300,"content":"Juliet Ibrahim: Actress joins Cristiano Ronaldo to promote FIFA Women Football M&gt; https://t.co/YuzLu5Phgq https://t.co/URsD3zVuGi","date":"2016-03-06T16:50:44.000Z","likes":0},"tweeter":{"id":2463511302,"name":"Pulse Ghana","handle":"PulseGhana"}},{"tweet":{"id":706524642517897200,"content":"Ceux qui pensent qu'on s'enflamme sur DembÃ©lÃ© ... Il nous donne juste envie de regarder Ã  nouveau du football. Voir un jeune tout casser â¤ï¸ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½","date":"2016-03-06T16:59:36.000Z","likes":0},"tweeter":{"id":2412480251,"name":"Elsaaaaaaaaaaw âš½âœŒ","handle":"elsaaw_18"}}];
