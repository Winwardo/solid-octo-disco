const Twit = require('twit');
const moment = require('moment');
import { exampleSearch } from './exampleSearch';
import { db } from './orientdb';
import { TweeterBuilder, TweetBuilder } from '../shared/data/databaseObjects';
import { flattenImmutableObject } from '../shared/utilities';

// These keys should be hidden in a private config file or environment variables
// For simplicity of this assignment, they will be visible here
var T = new Twit({
  consumer_key:         'YiSLB0kOlsTd21UGYT32YOUgg',
  consumer_secret:      '78b5VrGzkcIkpmftLdlFwirraelPRq2t5bFlgEcMkfaQqQh1Mb',
  access_token:         '1831536590-kX7HPRraGcbs5t9xz1wg0QdsvbOAW4pFK5L0Y68',
  access_token_secret:  'ceYqZAulg2MT89Jw11rA44FOwHOFcEccFv9HXFIG9ckJf',
  timeout_ms:           60 * 1000,  // optional HTTP request timeout to apply to all requests.
});

const runQueryOnImmutableObject = (db, query, objectToFlatten) => {
  return db.query(query, { 'params': flattenImmutableObject(objectToFlatten) });
};

const upsertTweeter = (db, tweeter) => {
  return runQueryOnImmutableObject(
    db,
    'UPDATE tweeter SET name=:name, handle=:handle UPSERT WHERE handle=:handle',
    tweeter);
};

const upsertTweet = (db, tweet) => {
  return runQueryOnImmutableObject(
    db,
    'UPDATE tweet SET id=:id, content=:content, date=:date, likes=:likes, retweets=:retweets UPSERT WHERE id=:id',
    tweet);
};

const makeTWEETEDedge = (db, tweet, tweeter) => {
  return db.query(
    'CREATE EDGE TWEETED FROM (SELECT FROM tweeter WHERE handle = :tweeterHandle) TO (SELECT FROM tweet WHERE id = :tweetId)',
    {
      'params': {
        'tweetId': tweet.id(),
        'tweeterHandle': tweeter.handle(),
      },
    });
};

export const test = (res) => {
  //T.get('search/tweets', { q: 'liverpool', count: 100 }, function (err, data, response) {
  //  console.log(data);
  //  res.end(JSON.stringify(data));
  //});
  exampleSearch.statuses.forEach((status) => {
    const user = status.user;

    const tweet = TweetBuilder()
      .id(status.id)
      .content(status.text)
      .date(moment(status.created_at).format('YYYY-MM-DD HH:mm:ss'))
      .likes(status.favourite_count || 0)
      .retweets(status.retweet_count || 0)
      .build();

    const tweeter = TweeterBuilder()
      .name(user.name)
      .handle(user.screen_name)
      .build();

    upsertTweeter(db, tweeter)
        .then((result) => {
          upsertTweet(db, tweet)
            .then((result) => {
              makeTWEETEDedge(db, tweet, tweeter);
            });
        });
  });

  res.end(JSON.stringify(exampleSearch));

  //});
};
