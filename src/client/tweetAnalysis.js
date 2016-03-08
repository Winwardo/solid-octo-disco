import { flattenObjectToArray } from './../shared/utilities';

// http://www.ranks.nl/stopwords
const stopList = ['a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', "aren't", 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', "can't", 'cannot', 'could', "couldn't", 'did', "didn't", 'do', 'does', "doesn't", 'doing', "don't", 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', "hadn't", 'has', "hasn't", 'have', "haven't", 'having', 'he', "he'd", "he'll", "he's", 'her', 'here', "here's", 'hers', 'herself', 'him', 'himself', 'his', 'how', "how's", 'i', "i'd", "i'll", "i'm", "i've", 'if', 'in', 'into', 'is', "isn't", 'it', "it's", 'its', 'itself', "let's", 'me', 'more', 'most', "mustn't", 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours	ourselves', 'out', 'over', 'own', 'same', "shan't", 'she', "she'd", "she'll", "she's", 'should', "shouldn't", 'so', 'some', 'such', 'than', 'that', "that's", 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', "there's", 'these', 'they', "they'd", "they'll", "they're", "they've", 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', "wasn't", 'we', "we'd", "we'll", "we're", "we've", 'were', "weren't", 'what', "what's", 'when', "when's", 'where', "where's", 'which', 'while', 'who', "who's", 'whom', 'why', "why's", 'with', "won't", 'would', "wouldn't", 'you', "you'd", "you'll", "you're", "you've", 'your', 'yours', 'yourself', 'yourselves'];

/**
 * Given a list of Tweet objects, return a sorted list of the most frequent words in them
 * @param tweets
 * @returns {Array}
 */
export const mostFrequentWords = (tweets) => {
  return wordCountToSortedList(countWords(tweets, stopList));
};

export const groupedCountWords = (countedWords) => {
  return [];
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
function countWords(tweets, stopList = []) {
  const wordCount = {};
  for (const tweet of tweets) {
    for (const word of tweet.content.split(/[ !,.?"'=]/)) {
      const trimmed = word.trim();
      const lowerCase = trimmed.toLowerCase();
      if (
        (lowerCase !== '') &&
        (stopList.indexOf(lowerCase) == -1) &&
        lowerCase.length > 1
      ) {
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

  return result.sort((wordCount1, wordCount2) => { return wordCount2.count - wordCount1.count; });
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

export const exampleTweets = [{ 'tweet':{ 'id':706525663755264000, 'content':'SIDEMEN GIANT FOOTBALL CHALLENGE! https://t.co/9B1YNc9k6e', 'date':'2016-03-06T17:03:39.000Z', 'likes':0 }, 'tweeter':{ 'id':3287919378, 'name':'Anna â˜… [SDMN]', 'handle':'AnnaJoyce_15' } }, { 'tweet':{ 'id':706518094450135000, 'content':'Crystal Palace Football Club https://t.co/DTD8gwMZjm', 'date':'2016-03-06T16:33:34.000Z', 'likes':0 }, 'tweeter':{ 'id':62586199, 'name':'maxwell', 'handle':'MaxC25' } }, { 'tweet':{ 'id':706522750572175400, 'content':'Whenever I watch football in Hamburg I got the smell of weed coming my way.., are all football fans in this city members of the Green Party?', 'date':'2016-03-06T16:52:04.000Z', 'likes':0 }, 'tweeter':{ 'id':246151676, 'name':'Norwegian Musings', 'handle':'normusings' } }, { 'tweet':{ 'id':706525993855545300, 'content':'Fluminense Switch to DryWorld. 2016 Kits Revealed. https://t.co/FTwbjpFxAf FOOTBALL https://t.co/QgnJT4Sp4p', 'date':'2016-03-06T17:04:58.000Z', 'likes':0 }, 'tweeter':{ 'id':1060055503, 'name':'soccernews_2013', 'handle':'soccernews_2013' } }, { 'tweet':{ 'id':706505553275658200, 'content':'The drought is over...\n\nLionel Messi scores his first goal in 60 minutes of football. https://t.co/Eop2wxmsWQ', 'date':'2016-03-06T15:43:44.000Z', 'likes':0 }, 'tweeter':{ 'id':221769011, 'name':'bet365', 'handle':'bet365' } }, { 'tweet':{ 'id':706496134848446500, 'content':'I support #MarcoRubio No one quits football during the 2nd quarter! GO #MarcoRubio #FloridaPrimary https://t.co/OfQAub9vs6', 'date':'2016-03-06T15:06:19.000Z', 'likes':0 }, 'tweeter':{ 'id':3047952655, 'name':'JaneAnn', 'handle':'masterscreek' } }, { 'tweet':{ 'id':706526000834867200, 'content':'@Espngreeny More times than not, DEFENSE wins in playoffs. Until this year, Manning\'s teams never had a great defense...Football=team game.', 'date':'2016-03-06T17:04:59.000Z', 'likes':0 }, 'tweeter':{ 'id':24758898, 'name':'David Grim', 'handle':'davidgrim22' } }, { 'tweet':{ 'id':706514728516866000, 'content':'Multiple titles. Multiple records. And one super finale.\n\nPeyton Manning\'s football legacy: https://t.co/0WlB8SGyQX https://t.co/veVfMuGV5n', 'date':'2016-03-06T16:20:12.000Z', 'likes':0 }, 'tweeter':{ 'id':439848268, 'name':'Marshall Byers', 'handle':'MackinMarshall' } }, { 'tweet':{ 'id':706522412087648300, 'content':'Juliet Ibrahim: Actress joins Cristiano Ronaldo to promote FIFA Women Football M&gt; https://t.co/YuzLu5Phgq https://t.co/URsD3zVuGi', 'date':'2016-03-06T16:50:44.000Z', 'likes':0 }, 'tweeter':{ 'id':2463511302, 'name':'Pulse Ghana', 'handle':'PulseGhana' } }, { 'tweet':{ 'id':706524642517897200, 'content':'Ceux qui pensent qu\'on s\'enflamme sur DembÃ©lÃ© ... Il nous donne juste envie de regarder Ã  nouveau du football. Voir un jeune tout casser â¤ï¸ï¿½ï¿½ï¿½ï¿½ï¿½ï¿½', 'date':'2016-03-06T16:59:36.000Z', 'likes':0 }, 'tweeter':{ 'id':2412480251, 'name':'Elsaaaaaaaaaaw âš½âœŒ', 'handle':'elsaaw_18' } }];
