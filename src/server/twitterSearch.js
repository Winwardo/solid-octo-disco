const Twit = require('twit');
const moment = require('moment');
import { exampleSearch } from './exampleSearch';
import { db } from './orientdb';
import { linkTweetToHashtag, linkTweeterToTweet, linkTweeterToRetweet, linkTweetToTweeterViaMention, upsertHashtag, upsertTweet, upsertTweeter } from '../shared/data/databaseInsertActions';
import * as Builders from '../shared/data/databaseObjects';
import { chainPromises } from '../shared/utilities';

// These keys should be hidden in a private config file or environment variables
// For simplicity of this assignment, they will be visible here
var T = new Twit({
  'consumer_key':         'YiSLB0kOlsTd21UGYT32YOUgg',
  'consumer_secret':      '78b5VrGzkcIkpmftLdlFwirraelPRq2t5bFlgEcMkfaQqQh1Mb',
  'access_token':         '1831536590-kX7HPRraGcbs5t9xz1wg0QdsvbOAW4pFK5L0Y68',
  'access_token_secret':  'ceYqZAulg2MT89Jw11rA44FOwHOFcEccFv9HXFIG9ckJf',
  'timeout_ms':           60 * 1000,  // optional HTTP request timeout to apply to all requests.
});

/**
 * Convert some raw status from the Twitter API into a proper immutable Tweet object.
 * @param rawTweet From the Twitter API.
 * @returns {ImmutableTweet}
 */
const buildTweetFromRaw = (rawTweet) => {
  return Builders.TweetBuilder()
    .id(rawTweet.id)
    .content(rawTweet.text)
    .date(moment(new Date(rawTweet.created_at)).format('YYYY-MM-DD HH:mm:ss'))
    .likes(rawTweet.favourite_count || 0)
    .retweets(rawTweet.retweet_count || 0)
    .build();
};

/**
 * Convert some raw user from the Twitter API into a proper immutable Tweeter object.
 * @param rawTweeter From the Twitter API.
 * @returns {ImmutableTweet}
 */
const buildTweeterFromRaw = (rawTweeter) => {
  return Builders.TweeterBuilder()
    .id(rawTweeter.id)
    .name(rawTweeter.name)
    .handle(rawTweeter.screen_name)
    .build();
}

/**
 * Given some raw status we know is a retweet, insert it and add a RETWEETED link.
 * @param db The OrientDB instance
 * @param retweetRaw A raw status from the Twitter API
 * @param retweeter An immutable Tweeter object
 * @returns {Promise}
 */
function processRawRetweet(db, retweetRaw, retweeter) {
  const originalTweeter = buildTweeterFromRaw(retweetRaw.user);
  const originalTweet = buildTweeterFromRaw(retweetRaw);

  return chainPromises(() => {
    return upsertTweeter(db, retweeter);
  }).then(() => {
    return processRawOriginalTweet(db, retweetRaw, originalTweeter);
  }).then(() => {
    return linkTweeterToRetweet(db, retweeter, originalTweet);
  });
}

/**
 * Given a raw status we know is not a retweet, insert it and upsert the user.
 * @param db The OrientDB instance
 * @param tweetRaw A raw status from the Twitter API
 * @param originalTweeter An immutable Tweeter object
 * @returns {Promise}
 */
function processRawOriginalTweet(db, tweetRaw, originalTweeter) {
  const tweet = buildTweetFromRaw(tweetRaw);

  return chainPromises(() => {
    return upsertTweet(db, tweet);
  }).then(() => {
    return upsertTweeter(db, originalTweeter);
  }).then(() => {
    return linkTweeterToTweet(db, originalTweeter, tweet);
  })
  .then(() => {
    return Promise.all(
      tweetRaw.entities.hashtags.map((hashtagRaw) => {
        const hashtag = Builders.HashtagBuilder().content(hashtagRaw.text.toLowerCase()).build();
        return upsertHashtag(db, hashtag).then((result) => {
          return linkTweetToHashtag(db, tweet, hashtag);
        });
      })
    );
  }).then(() => {
    return Promise.all(
      tweetRaw.entities.user_mentions.map((mentionRaw) => {
        const mentionedTweeter = buildTweeterFromRaw(mentionRaw);
        return upsertTweeter(db, mentionedTweeter).then((result) => {
          return linkTweetToTweeterViaMention(db, tweet, mentionedTweeter);
        });
      })
    );
  });
}

/**
 * Given a raw tweet, extract information about the tweeter,
 * if it was a retweet, etc, and store all information in
 * the database.
 * @param db The OrientDB instance
 * @param tweetRaw The original status object from the Twitter API
 * @returns {Promise.<T>}
 */
const processTweet = (db, tweetRaw) => {
  const tweeter = buildTweeterFromRaw(tweetRaw.user);
  const retweetedStatusRaw = tweetRaw['retweeted_status'];

  if (retweetedStatusRaw !== undefined) {
    return processRawRetweet(db, retweetedStatusRaw, tweeter);
  } else {
    console.log('Process original tweet.');
    return processRawOriginalTweet(db, tweetRaw, tweeter);
  };
};

/**
 * Search the Twitter API for some query, saving and displaying the results.
 * @param res HTTP Response object
 * @param query Query to search twitter
 */
export const searchAndSave = (res, query) => {
  T.get('search/tweets', { 'q': query, 'count': 20 }, function (err, result, response) {
    Promise.all(
      result.statuses.map((tweetRaw) => {
        return processTweet(db, tweetRaw);
      })
    ).then(() => {
      res.end(JSON.stringify(result));
    });
  });
};

/**
 * Connect to the Twitter Stream API for one minute, processing all results.
 * @param req HTTP Request object with `query` parameter
 * @param res HTTP Response object
 */
export const stream = (req, res) => {
  const stream = T.stream('statuses/filter', { 'track': req.params.query });

  stream.on('tweet', (tweet) => {
    processTweet(tweet);
    console.log(tweet.text);
    res.write(`${tweet.text}`);
  });

  setTimeout(() => {
    stream.stop();
    console.log('END');
    res.end('END');
  }, 60000);
};
