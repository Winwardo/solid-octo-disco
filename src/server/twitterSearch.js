const Twit = require('twit');
const moment = require('moment');
import { exampleSearch } from './exampleSearch';
import { db } from './orientdb';
import * as Builders from '../shared/data/databaseObjects';
import { linkTweetToHashtag, linkTweeterToTweet, linkTweetToTweeterViaMention, upsertHashtag, upsertTweet, upsertTweeter } from '../shared/data/databaseInsertActions';

// These keys should be hidden in a private config file or environment variables
// For simplicity of this assignment, they will be visible here
var T = new Twit({
  'consumer_key':         'YiSLB0kOlsTd21UGYT32YOUgg',
  'consumer_secret':      '78b5VrGzkcIkpmftLdlFwirraelPRq2t5bFlgEcMkfaQqQh1Mb',
  'access_token':         '1831536590-kX7HPRraGcbs5t9xz1wg0QdsvbOAW4pFK5L0Y68',
  'access_token_secret':  'ceYqZAulg2MT89Jw11rA44FOwHOFcEccFv9HXFIG9ckJf',
  'timeout_ms':           60 * 1000,  // optional HTTP request timeout to apply to all requests.
});

const makeTweeterFromRaw = (raw) => {
  return Builders.TweeterBuilder()
    .id(raw.id)
    .name(raw.name)
    .handle(raw.screen_name)
    .build();
};

export const searchAndSave = (res, query) => {
  T.get('search/tweets', { 'q': query, 'count': 300 }, function (err, result, response) {
    let count = 0;
    result.statuses.forEach((tweetRaw) => {
      const userRaw = tweetRaw.user;

      const tweet = Builders.TweetBuilder()
        .id(tweetRaw.id)
        .content(tweetRaw.text)
        .date(moment(new Date(tweetRaw.created_at)).format('YYYY-MM-DD HH:mm:ss'))
        .likes(tweetRaw.favourite_count || 0)
        .retweets(tweetRaw.retweet_count || 0)
        .build();

      const tweeter = makeTweeterFromRaw(userRaw);

      upsertTweeter(db, tweeter).then((result) => {
        upsertTweet(db, tweet).then((result) => {
          linkTweeterToTweet(db, tweeter, tweet);
        });
      });

      tweetRaw.entities.hashtags.forEach((hashtagRaw) => {
        const hashtag = Builders.HashtagBuilder().content(hashtagRaw.text.toLowerCase()).build();
        upsertHashtag(db, hashtag).then((result) => {
          linkTweetToHashtag(db, tweet, hashtag);
        });
      });

      tweetRaw.entities.user_mentions.forEach((mentionRaw) => {
        const mentionedTweeter = makeTweeterFromRaw(mentionRaw);
        upsertTweeter(db, mentionedTweeter).then((result) => {
          linkTweetToTweeterViaMention(db, tweet, mentionedTweeter);
        });
      });
    });

    res.end(JSON.stringify(result));
  });
};
