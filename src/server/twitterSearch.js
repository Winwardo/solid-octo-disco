const Twit = require('twit');
const moment = require('moment');
import { exampleSearch } from './exampleSearch';
import { db } from './orientdb';
import * as Builders from '../shared/data/databaseObjects';
import { flattenImmutableObject } from '../shared/utilities';

// These keys should be hidden in a private config file or environment variables
// For simplicity of this assignment, they will be visible here
var T = new Twit({
  'consumer_key':         'YiSLB0kOlsTd21UGYT32YOUgg',
  'consumer_secret':      '78b5VrGzkcIkpmftLdlFwirraelPRq2t5bFlgEcMkfaQqQh1Mb',
  'access_token':         '1831536590-kX7HPRraGcbs5t9xz1wg0QdsvbOAW4pFK5L0Y68',
  'access_token_secret':  'ceYqZAulg2MT89Jw11rA44FOwHOFcEccFv9HXFIG9ckJf',
  'timeout_ms':           60 * 1000,  // optional HTTP request timeout to apply to all requests.
});

const runQueryOnImmutableObject = (db, query, objectToFlatten) => {
  return db.query(query, { 'params': flattenImmutableObject(objectToFlatten) });
};

const upsertTweeter = (db, tweeter) => {
  return runQueryOnImmutableObject(
    db,
    'UPDATE tweeter SET id=:id, name=:name, handle=:handle UPSERT WHERE handle=:handle',
    tweeter);
};

const upsertTweet = (db, tweet) => {
  return runQueryOnImmutableObject(
    db,
    'UPDATE tweet SET id=:id, content=:content, date=:date, likes=:likes, retweets=:retweets UPSERT WHERE id=:id',
    tweet);
};

const upsertHashtag = (db, hashtag) => {
  return runQueryOnImmutableObject(
    db,
    'UPDATE hashtag SET content=:content UPSERT WHERE content=:content',
    hashtag);
};

const linkTweeterToTweet = (db, tweeter, tweet) => {
  return db.query(
    'CREATE EDGE TWEETED FROM (SELECT FROM tweeter WHERE id = :tweeterId) TO (SELECT FROM tweet WHERE id = :tweetId)',
    {
      'params': {
        'tweetId': tweet.id(),
        'tweeterId': tweeter.id(),
      },
    });
};

const linkTweetToHashtag = (db, tweet, hashtag) => {
  return db.query(
    'CREATE EDGE HAS_HASHTAG FROM (SELECT FROM tweet WHERE id = :tweetId) TO (SELECT FROM hashtag WHERE content = :hashtagContent)',
    {
      'params': {
        'tweetId': tweet.id(),
        'hashtagContent': hashtag.content(),
      },
    });
};

export const test = (res) => {
  //T.get('search/tweets', { q: 'liverpool', count: 100 }, function (err, data, response) {
  //  console.log(data);
  //  res.end(JSON.stringify(data));
  //});
  let count = 0;
  exampleSearch.statuses.forEach((tweetRaw) => {
    const userRaw = tweetRaw.user;

    const tweet = Builders.TweetBuilder()
      .id(tweetRaw.id)
      .content(tweetRaw.text)
      .date(moment(new Date(tweetRaw.created_at)).format('YYYY-MM-DD HH:mm:ss'))
      .likes(tweetRaw.favourite_count || 0)
      .retweets(tweetRaw.retweet_count || 0)
      .build();

    const tweeter = Builders.TweeterBuilder()
      .id(userRaw.id)
      .name(userRaw.name)
      .handle(userRaw.screen_name)
      .build();

    upsertTweeter(db, tweeter)
        .then((result) => {
          upsertTweet(db, tweet)
            .then((result) => {
              linkTweeterToTweet(db, tweeter, tweet);
            });
        });

    tweetRaw.entities.hashtags.forEach((hashtagRaw) => {
      const hashtag = Builders.HashtagBuilder().content(hashtagRaw.text.toLowerCase()).build();
      upsertHashtag(db, hashtag).then((result) => {
        linkTweetToHashtag(db, tweet, hashtag);
      });
    });
  });

  res.end(JSON.stringify(exampleSearch));

  //});
};
