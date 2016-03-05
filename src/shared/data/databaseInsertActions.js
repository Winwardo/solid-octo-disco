import { flattenImmutableObject } from '../utilities';

const runQueryOnImmutableObject = (db, query, objectToFlatten) => {
  return db.query(query, { 'params': flattenImmutableObject(objectToFlatten) });
};

export const upsertTweeter = (db, tweeter) => {
  return runQueryOnImmutableObject(
    db,
    'UPDATE tweeter SET id=:id, name=:name, handle=:handle UPSERT WHERE id=:id',
    tweeter).then((r) => {
      console.log(`upserted tweeter: ${tweeter.id()}`);
    });
};

export const upsertTweet = (db, tweet) => {
  return runQueryOnImmutableObject(
    db,
    'UPDATE tweet SET id=:id, content=:content, date=:date, likes=:likes, retweets=:retweets UPSERT WHERE id=:id',
    tweet).then((r) => {
    console.log(`upserted tweet: ${tweet.id()}`);
  });
};

export const upsertHashtag = (db, hashtag) => {
  return runQueryOnImmutableObject(
    db,
    'UPDATE hashtag SET content=:content UPSERT WHERE content=:content',
    hashtag);
};

export const linkTweeterToTweet = (db, tweeter, tweet) => {
  return db.query(
    'CREATE EDGE TWEETED FROM (SELECT FROM tweeter WHERE id = :tweeterId) TO (SELECT FROM tweet WHERE id = :tweetId)',
    {
      'params': {
        'tweetId': tweet.id(),
        'tweeterId': tweeter.id(),
      },
    });
};

export const linkTweeterToRetweet = (db, tweeter, tweet) => {
  //console.log(`tweeter: ${tweeter.id()} RETWEETED tweet: ${tweet.id()}`);
  return db.query(
    'CREATE EDGE RETWEETED FROM (SELECT FROM tweeter WHERE id = :tweeterId) TO (SELECT FROM tweet WHERE id = :tweetId)',
    {
      'params': {
        'tweetId': tweet.id(),
        'tweeterId': tweeter.id(),
      },
    }).error((e) => {
      console.log(`failed on tweeter: ${tweeter.id()} RETWEETED tweet: ${tweet.id()}`);
    });
};

export const linkTweetToHashtag = (db, tweet, hashtag) => {
  return db.query(
    'CREATE EDGE HAS_HASHTAG FROM (SELECT FROM tweet WHERE id = :tweetId) TO (SELECT FROM hashtag WHERE content = :hashtagContent)',
    {
      'params': {
        'tweetId': tweet.id(),
        'hashtagContent': hashtag.content(),
      },
    });
};

export const linkTweetToTweeterViaMention = (db, tweet, mentionedTweeter) => {
  return db.query(
    'CREATE EDGE MENTIONS FROM (SELECT FROM tweet WHERE id = :tweetId) TO (SELECT FROM tweeter WHERE id = :mentionedTweeterId)',
    {
      'params': {
        'tweetId': tweet.id(),
        'mentionedTweeterId': mentionedTweeter.id(),
      },
    });
};
