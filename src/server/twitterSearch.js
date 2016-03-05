const Twit = require('twit');
const moment = require('moment');
import { exampleSearch } from './exampleSearch';
import { db } from './orientdb';
import * as Builders from '../shared/data/databaseObjects';
import { linkTweetToHashtag, linkTweeterToTweet, linkTweeterToRetweet, linkTweetToTweeterViaMention, upsertHashtag, upsertTweet, upsertTweeter } from '../shared/data/databaseInsertActions';

// These keys should be hidden in a private config file or environment variables
// For simplicity of this assignment, they will be visible here
var T = new Twit({
  'consumer_key':         'YiSLB0kOlsTd21UGYT32YOUgg',
  'consumer_secret':      '78b5VrGzkcIkpmftLdlFwirraelPRq2t5bFlgEcMkfaQqQh1Mb',
  'access_token':         '1831536590-kX7HPRraGcbs5t9xz1wg0QdsvbOAW4pFK5L0Y68',
  'access_token_secret':  'ceYqZAulg2MT89Jw11rA44FOwHOFcEccFv9HXFIG9ckJf',
  'timeout_ms':           60 * 1000,  // optional HTTP request timeout to apply to all requests.
});

const makeTweetFromRaw = (raw) => {
  return Builders.TweetBuilder()
    .id(raw.id)
    .content(raw.text)
    .date(moment(new Date(raw.created_at)).format('YYYY-MM-DD HH:mm:ss'))
    .likes(raw.favourite_count || 0)
    .retweets(raw.retweet_count || 0)
    .build();
};

const makeTweeterFromRaw = (raw) => {
  return Builders.TweeterBuilder()
    .id(raw.id)
    .name(raw.name)
    .handle(raw.screen_name)
    .build();
};

const processTweet = (tweetRaw, isRetweet = false) => {
  const tweeter = makeTweeterFromRaw(tweetRaw.user);
  const retweetedStatusRaw = tweetRaw.retweeted_status;

  const upsertedTweeterPromise = upsertTweeter(db, tweeter);

  if (retweetedStatusRaw !== undefined) {
    // If this is a retweet, process the original tweet,
    // then make this user point at it.
    return upsertedTweeterPromise
      .then(() => {
        return processTweet(retweetedStatusRaw, true);
      })
      .then(() => {
        return linkTweeterToRetweet(db, tweeter, makeTweetFromRaw(retweetedStatusRaw));
      });
  } else {
    const tweet = Builders.TweetBuilder()
      .id(tweetRaw.id)
      .content(tweetRaw.text)
      .date(moment(new Date(tweetRaw.created_at)).format('YYYY-MM-DD HH:mm:ss'))
      .likes(tweetRaw.favourite_count || 0)
      .retweets(tweetRaw.retweet_count || 0)
      .build();

    return upsertedTweeterPromise
      .then((result) => {
        return upsertTweet(db, tweet);
      }).then(() => {
        return linkTweeterToTweet(db, tweeter, tweet);
      }).then(() => {
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
            const mentionedTweeter = makeTweeterFromRaw(mentionRaw);
            return upsertTweeter(db, mentionedTweeter).then((result) => {
              return linkTweetToTweeterViaMention(db, tweet, mentionedTweeter);
            });
          })
        );
      });
  };
};

export const searchAndSave = (res, query) => {
  T.get('search/tweets', { 'q': query, 'count': 1000 }, function (err, result, response) {
    Promise.all(
      result.statuses.map((tweetRaw) => {
        return processTweet(tweetRaw);
      })
    ).then(() => {
      res.end(JSON.stringify(result));
    });
  });
};

export const stream = (req, res) => {
  const stream = T.stream('statuses/filter', { 'track': req.params.query });

  stream.on('tweet', (tweet) => {
    processTweet(tweet);
    console.log(tweet.text);
    res.write(`${tweet.text}
`);
  });

  setTimeout(() => {
    stream.stop();
    res.end('END');
  }, 60000);
};;
