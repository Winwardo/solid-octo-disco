const Twit = require('twit');
const moment = require('moment');
import { db } from './orientdb';
import { linkTweetToHashtag, linkTweeterToTweet, linkTweeterToRetweet, linkTweetToTweeterViaMention,
  linkTweetToPlace, linkPlaceToCountry, linkQuoteTweetToOriginalTweet,
  upsertHashtag, upsertTweet, upsertTweeter, upsertPlace, upsertCountry
} from '../shared/data/databaseInsertActions';
import { getOriginalTweetUserFromQuoteTweet } from './tweetFinder';
import * as Builders from '../shared/data/databaseObjects';
import { newPromiseChain } from '../shared/utilities';

export const TWITTER_ENABLED = true;
const MAX_TWEETS_FROM_TWITTER_API = 100;

// These keys should be hidden in a private config file or environment variables
// For simplicity of this assignment, they will be visible here
export const TwitAccess = new Twit({
  access_token: '1831536590-kX7HPRraGcbs5t9xz1wg0QdsvbOAW4pFK5L0Y68',
  access_token_secret: 'ceYqZAulg2MT89Jw11rA44FOwHOFcEccFv9HXFIG9ckJf',
  consumer_key: 'YiSLB0kOlsTd21UGYT32YOUgg',
  consumer_secret: '78b5VrGzkcIkpmftLdlFwirraelPRq2t5bFlgEcMkfaQqQh1Mb',
  timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
});

/**
 * Convert some raw status from the Twitter API into a proper immutable Tweet object.
 * @param rawTweet From the Twitter API.
 * @returns {ImmutableTweet}
 */
const buildTweetFromRaw = (rawTweet) => {
  const coordinates = findLatitudeLongitude(rawTweet);
  return Builders.TweetBuilder()
    .id(rawTweet.id_str)
    .content(rawTweet.text)
    .date(moment(new Date(rawTweet.created_at)).format('YYYY-MM-DD HH:mm:ss'))
    .likes(rawTweet.favorite_count)
    .retweets(rawTweet.retweet_count)
    .latitude(coordinates.latitude)
    .longitude(coordinates.longitude)
    .contains_a_quoted_tweet(rawTweet.quoted_status ? rawTweet.quoted_status.id_str : '')
    .build();
};

/**
  * Finds if Latitude/Longitude coordinates exist in raw tweet, otherwise return 0.0 for both
  * @param rawTweet From the Twitter API.
  * @returns [latitude, longitude]
  */
const findLatitudeLongitude = (rawTweet) => {
  let test;
  try {
    if (rawTweet.geo) {
      test = 'geo';
      if (rawTweet.geo.coordinate) {
        return {
          latitude: rawTweet.geo.coordinate[0],
          longitude: rawTweet.geo.coordinate[1],
        };
      } else {
        return {
          latitude: rawTweet.geo.coordinates[0],
          longitude: rawTweet.geo.coordinates[1],
        };
      }
    } else if (rawTweet.coordinates) {
      test = 'coord';
      return {
        latitude: rawTweet.coordinates.coordinate[1],
        longitude: rawTweet.coordinates.coordinate[0],
      };
    } else if (rawTweet.place) {
      test = 'place';
      return {
        latitude: rawTweet.place.bounding_box.coordinates[0][0][1],
        longitude: rawTweet.place.bounding_box.coordinates[0][0][0],
      };
    }
  } catch (err) {
    console.warn(`Error parsing ${test} data in tweet #${rawTweet.id_str}.`);
  }

  return {
    latitude: 0.0,
    longitude: 0.0,
  };
};

/**
 * Convert some raw user from the Twitter API into a proper immutable Tweeter object.
 * @param rawTweeter From the Twitter API.
 * @param Boolean to signify if the passed in rawTweeter is a mention object
 * or a full user object that has a profile_image_url_https
 * @returns {ImmutableTweet}
 */
const buildTweeterFromRaw = (rawTweeter, isMentionUser) => {
  const tweeter = Builders.TweeterBuilder()
    .id(rawTweeter.id_str)
    .name(rawTweeter.name)
    .handle(rawTweeter.screen_name);

  if (isMentionUser) {
    tweeter.profile_image_url('none')
      .is_user_mention(true);
  } else {
    tweeter.profile_image_url(rawTweeter.profile_image_url_https)
      .is_user_mention(false);
  }

  return tweeter.build();
};

const buildPlaceFromRaw = (rawPlace) => (
  Builders.PlaceBuilder()
    .id(rawPlace.id)
    .name(rawPlace.name)
    .full_name(rawPlace.full_name)
    .type(rawPlace.place_type)
    .build()
);

/**
 * Given some raw status we know is a retweet, insert it and add a RETWEETED link.
 * @param db The OrientDB instance
 * @param retweeter An immutable Tweeter object representing the author of the rawTweet
 * @param rawRetweet A raw status from the Twitter API representing a retweet
 * @returns {Promise}
 */
const processRawRetweet = (db, retweeter, rawRetweet) => {
  const originalTweeter = buildTweeterFromRaw(rawRetweet.user, false);
  const originalTweet = buildTweetFromRaw(rawRetweet);
  const rawQuotedStatus = rawRetweet.quoted_status;

  return newPromiseChain()
    .then(() => upsertTweeter(db, retweeter))
    .then(() => {
      // if the retweet is a quoted tweet then process the quote tweet
      // link the quote tweet to the retweet
      if (rawQuotedStatus) {
        return processQuoteTweet(db, rawRetweet, rawQuotedStatus);
      }

      return processRawOriginalTweet(db, rawRetweet, originalTweeter);
    })
    .then(() => linkTweeterToRetweet(db, retweeter, originalTweet));
};

/**
 * Given some raw status we know is a quote, insert it and a QUOTED link.
 * @param db The OrientDB instance
 * @param rawQuoteTweet A raw status from the twitter API which represents the tweet that quoted the rawOriginalTweet
 * @param rawOriginalTweet A raw status from the twitter API which represents the tweet that was quoted
 * @returns {Promise}
 */
const processQuoteTweet = (db, rawQuoteTweet, rawOriginalTweet) => {
  const originalTweet = buildTweetFromRaw(rawOriginalTweet);
  const quoteTweet = buildTweetFromRaw(rawQuoteTweet);
  const quoteTweeter = buildTweeterFromRaw(rawQuoteTweet.user, false);

  return newPromiseChain()
    .then(() => processRawOriginalTweet(db, rawQuoteTweet, quoteTweeter))
    .then(() => {
      if (rawOriginalTweet.user) {
        return buildTweeterFromRaw(rawOriginalTweet.user, false);
      }

      return getOriginalTweetUserFromQuoteTweet(rawOriginalTweet);
    })
    .then((originalTweeter) => processRawOriginalTweet(db, rawOriginalTweet, originalTweeter))
    .then(() => linkQuoteTweetToOriginalTweet(db, quoteTweet, originalTweet));
};

/**
 * Link a tweet to all of its hashtags
 * @param db The OrientDB instance
 * @param rawHashtags The original hashtags
 * @param tweet
 * @returns {Promise}
 */
const linkTweetToHashtags = (db, rawHashtags, tweet) => (
  Promise.all(
    rawHashtags.map((rawHashtag) => {
      const hashtag = Builders.HashtagBuilder().content(rawHashtag.text.toLowerCase()).build();

      return newPromiseChain()
        .then(() => upsertHashtag(db, hashtag))
        .then(() => linkTweetToHashtag(db, tweet, hashtag));
    })
  )
);

const linkTweetToMentions = (db, rawMentions, tweet) => (
  Promise.all(
    rawMentions.map((rawMention) => {
      const mentionedTweeter = buildTweeterFromRaw(rawMention, true);

      return newPromiseChain()
        .then(() => upsertTweeter(db, mentionedTweeter))
        .then(() => linkTweetToTweeterViaMention(db, tweet, mentionedTweeter));
    })
  )
);

/**
 * Given a raw status we know is not a retweet, insert it and upsert the user.
 * @param db The OrientDB instance
 * @param rawTweet A raw status from the Twitter API
 * @param originalTweeter An immutable Tweeter object
 * @returns {Promise}
 */
const processRawOriginalTweet = (db, rawTweet, originalTweeter) => {
  const tweet = buildTweetFromRaw(rawTweet);
  const rawHashtags = rawTweet.entities.hashtags;
  const rawMentions = rawTweet.entities.user_mentions;

  return newPromiseChain()
    .then(() => upsertTweet(db, tweet))
    .then(() => upsertTweeter(db, originalTweeter))
    .then(() => linkTweeterToTweet(db, originalTweeter, tweet))
    .then(() => linkTweetToLocation(db, tweet, rawTweet.place))
    .then(() => linkTweetToHashtags(db, rawHashtags, tweet))
    .then(() => linkTweetToMentions(db, rawMentions, tweet));
};

/**
 * Given a tweet, if it has a place upsert the place and link it to a country
 * @param db the OrientDB instance
 * @param tweet A processed tweet to link to a place
 * @param rawTweet A raw tweet's place property from the Twitter API
 * @returns {Promise}
 */
const linkTweetToLocation = (db, tweet, rawPlace) => {
  if (rawPlace) {
    const place = buildPlaceFromRaw(rawPlace);
    const country = Builders.CountryBuilder()
      .code(rawPlace.country_code)
      .name(rawPlace.country)
      .build();

    return newPromiseChain()
      .then(() => upsertPlace(db, place))
      .then(() => upsertCountry(db, country))
      .then(() => linkTweetToPlace(db, tweet, place))
      .then(() => linkPlaceToCountry(db, place, country));
  }

  return Promise.resolve();
};

/**
 * Given a raw tweet, extract information about the tweeter,
 * if it was a retweet, etc, and store all information in
 * the database.
 * @param db The OrientDB instance
 * @param rawTweet The original status object from the Twitter API
 * @returns {Promise.<TwitAccess>}
 */
const processTweet = (db, rawTweet) => {
  const tweeter = buildTweeterFromRaw(rawTweet.user, false);
  const rawRetweetedStatus = rawTweet.retweeted_status;
  const rawQuotedStatus = rawTweet.quoted_status;

  if (rawRetweetedStatus) {
    return processRawRetweet(db, tweeter, rawRetweetedStatus);
  }
  if (rawQuotedStatus) {
    return processQuoteTweet(db, rawTweet, rawQuotedStatus);
  }

  return processRawOriginalTweet(db, rawTweet, tweeter);
};

/**
 * Search the Twitter API for some query, saving and displaying the results.
 * @param query Query to search twitter
 */
export const searchAndSaveFromTwitter = (query, count = 300) => {
  if (TWITTER_ENABLED) {
    console.info(`Searching Twitter for query '${query}'.`);
    return newPromiseChain()
      .then(() => sweepTwitterAndConcat(query, count))
      .then(
        (statuses) => {
          console.info(`Twitter search for '${query}' successful! Found ${statuses.length} relevant Tweets.`);

          return Promise.all(
            statuses.map((rawTweet) => processTweet(db, rawTweet))
          ).then(
            () => console.log('Successfully processed the Tweets.'),
            (rej) => console.warn('failed to process the tweet into the database cache', rej)
          );
        },
        (rej) => {
          console.warn('Unable to search Twitter.', rej);
        }
      );
  } else {
    console.info(`Twitter disabled, not searching query '${query}'.`);
    return Promise.resolve();
  }
};

const sweepTwitterAndConcat = (query, count, existingStatuses = [], lowestId = null) => {
  let extendedQuery = query;
  if (lowestId !== null) {
    extendedQuery += ` max_id:${lowestId}`;
  };

  return newPromiseChain()
    .then(() => potentiallySearchTwitter(extendedQuery, count))
    .then((twitStatuses) => {
      const countLeft = count - MAX_TWEETS_FROM_TWITTER_API;
      const added = twitStatuses.length;

      if (countLeft > 0 && added > 0) {
        const newLowestId = Math.min(...twitStatuses.map((status) => status.id));

        return newPromiseChain()
          .then(() => sweepTwitterAndConcat(query, countLeft, twitStatuses, newLowestId))
          .then((results) => existingStatuses.concat(results));
      } else {
        return existingStatuses.concat(twitStatuses);
      }
    });
};

const potentiallySearchTwitter = (exactQuery, count) => {
  if (count > 0) {
    const actualCount = Math.min(count, MAX_TWEETS_FROM_TWITTER_API); // Twitter will only return a max of 100 Tweets at any time
    return newPromiseChain()
      .then(() => TwitAccess.get('search/tweets', { q: `${exactQuery} filter:safe`, count: actualCount }))
      .then((twitResults) => twitResults.data.statuses);
  } else {
    return [];
  }
};

export const searchAndSaveResponse = (res, query) => (
  searchAndSaveFromTwitter(query).then((result) => {
    res.end(JSON.stringify(result));
  })
);

/**
 * Connect to the Twitter Stream API for one minute, processing all results.
 * @param req HTTP Request object with `query` parameter
 * @param res HTTP Response object
 */
export const stream = (req, res) => {
  const stream = TwitAccess.stream('statuses/filter', { track: req.params.query });

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
