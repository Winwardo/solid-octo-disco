import { flattenImmutableObject } from '../utilities';

const runQueryOnImmutableObject = (db, query, objectToFlatten) => {
  return db.query(query, { 'params': flattenImmutableObject(objectToFlatten) });
};

export const upsertTweeter = (db, tweeter) => {
  return runQueryOnImmutableObject(
    db,
    'UPDATE tweeter SET id=:id, name=:name, handle=:handle UPSERT WHERE id=:id',
    tweeter).then(() => {}, (rej) => { console.log("^tweeter", rej); });
};

export const upsertTweet = (db, tweet) => {
  return runQueryOnImmutableObject(
    db,
    'UPDATE tweet SET id=:id, content=:content, date=:date, likes=:likes, retweets=:retweets UPSERT WHERE id=:id',
    tweet).then(() => {}, (rej) => { console.log("^tweet", rej); });
};

export const upsertHashtag = (db, hashtag) => {
  return runQueryOnImmutableObject(
    db,
    'UPDATE hashtag SET content=:content UPSERT WHERE content=:content',
    hashtag).then(() => {}, (rej) => { console.log("^hashtag", rej); });
};

export const linkTweeterToTweet = (db, tweeter, tweet) => {
  return db.query(
    'CREATE EDGE TWEETED FROM (SELECT FROM tweeter WHERE id = :tweeterId) TO (SELECT FROM tweet WHERE id = :tweetId)',
    {
      'params': {
        'tweetId': tweet.id(),
        'tweeterId': tweeter.id(),
      },
    }).then(() => {}, (rej) => { console.log("tweeter -> tweet", tweeter.handle(), tweet.content(), rej); });
};

export const linkTweeterToRetweet = (db, tweeter, tweet) => {
  return db.query(
    'CREATE EDGE RETWEETED FROM (SELECT FROM tweeter WHERE id = :tweeterId) TO (SELECT FROM tweet WHERE id = :tweetId)',
    {
      'params': {
        'tweetId': tweet.id(),
        'tweeterId': tweeter.id(),
      },
    }).then(() => {}, (rej) => { console.log("tweeter -> retweet", rej); });
};

export const linkTweetToHashtag = (db, tweet, hashtag) => {
  return db.query(
    'CREATE EDGE HAS_HASHTAG FROM (SELECT FROM tweet WHERE id = :tweetId) TO (SELECT FROM hashtag WHERE content = :hashtagContent)',
    {
      'params': {
        'tweetId': tweet.id(),
        'hashtagContent': hashtag.content(),
      },
    }).then(() => {}, (rej) => { console.log("tweet -> hashtag", rej); });
};

export const linkTweetToTweeterViaMention = (db, tweet, mentionedTweeter) => {
  return db.query(
    'CREATE EDGE MENTIONS FROM (SELECT FROM tweet WHERE id = :tweetId) TO (SELECT FROM tweeter WHERE id = :mentionedTweeterId)',
    {
      'params': {
        'tweetId': tweet.id(),
        'mentionedTweeterId': mentionedTweeter.id(),
      },
    }).then(() => {}, (rej) => { console.log("tweet -> tweeter", mentionedTweeter.handle(), tweet.content(), rej); });
};
