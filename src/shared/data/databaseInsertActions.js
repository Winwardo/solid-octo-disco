import { flattenImmutableObject } from '../utilities';

const runQueryOnImmutableObject = (db, query, objectToFlatten) => {
  return db.query(query, { 'params': flattenImmutableObject(objectToFlatten) });
};

export const upsertTweeter = (db, tweeter) => {
  return runQueryOnImmutableObject(
    db,
    'UPDATE tweeter SET id=:id, name=:name, handle=:handle UPSERT WHERE id=:id',
    tweeter).then(() => {}, (rej) => { console.error('Upsert tweeter', rej); });
};

export const upsertTweet = (db, tweet) => {
  return runQueryOnImmutableObject(
    db,
    'UPDATE tweet SET id=:id, content=:content, date=:date, likes=:likes, retweets=:retweets, longitude=:longitude, latitude=:latitude UPSERT WHERE id=:id',
    tweet).then(() => {}, (rej) => { console.error('Upsert tweet', rej); });
};

export const upsertHashtag = (db, hashtag) => {
  return runQueryOnImmutableObject(
    db,
    'UPDATE hashtag SET content=:content UPSERT WHERE content=:content',
    hashtag).then(() => {}, (rej) => { console.error('Upsert hashtag', rej); });
};

export const upsertPlace = (db, place) => (
  runQueryOnImmutableObject(
    db,
    'UPDATE place SET id=:id, name=:name, full_name=:full_name, type=:type UPSERT WHERE id=:id',
    place).then(() => {}, (rej) => console.error('Upsert Place', rej))
);

export const upsertCountry = (db, country) => (
  runQueryOnImmutableObject(
    db,
    'UPDATE country SET code=:code, name=:name UPSERT WHERE code=:code',
    country).then(() => {}, (rej) => {console.error('Upsert Place', rej);})
);

export const linkTweeterToTweet = (db, tweeter, tweet) => {
  return db.query(
    'CREATE EDGE TWEETED FROM (SELECT FROM tweeter WHERE id = :tweeterId) TO (SELECT FROM tweet WHERE id = :tweetId)',
    {
      'params': {
        'tweetId': tweet.id(),
        'tweeterId': tweeter.id(),
      },
    }).then(() => {}, (rej) => { console.error('Link tweeter -> tweet', tweeter.handle(), tweet.content(), rej); });
};

export const linkTweeterToRetweet = (db, tweeter, tweet) => {
  return db.query(
    'CREATE EDGE RETWEETED FROM (SELECT FROM tweeter WHERE id = :tweeterId) TO (SELECT FROM tweet WHERE id = :tweetId)',
    {
      'params': {
        'tweetId': tweet.id(),
        'tweeterId': tweeter.id(),
      },
    }).then(() => {}, (rej) => { console.error('Link tweeter -> retweet', rej); });
};

export const linkTweetToHashtag = (db, tweet, hashtag) => {
  return db.query(
    'CREATE EDGE HAS_HASHTAG FROM (SELECT FROM tweet WHERE id = :tweetId) TO (SELECT FROM hashtag WHERE content = :hashtagContent)',
    {
      'params': {
        'tweetId': tweet.id(),
        'hashtagContent': hashtag.content(),
      },
    }).then(() => {}, (rej) => { console.error('Link tweet -> hashtag', rej); });
};

export const linkTweetToTweeterViaMention = (db, tweet, mentionedTweeter) => {
  return db.query(
    'CREATE EDGE MENTIONS FROM (SELECT FROM tweet WHERE id = :tweetId) TO (SELECT FROM tweeter WHERE id = :mentionedTweeterId)',
    {
      'params': {
        'tweetId': tweet.id(),
        'mentionedTweeterId': mentionedTweeter.id(),
      },
    }).then(() => {}, (rej) => { console.error('Link tweet -> tweeter', mentionedTweeter.handle(), tweet.content(), rej); });
};

export const linkTweetToPlace = (db, tweet, place) => (
  db.query(
    'CREATE EDGE HAS_PLACE FROM (SELECT FROM tweet WHERE id = :tweetId) TO (SELECT FROM place WHERE id = :placeId)',
    {
      params: {
        tweetId: tweet.id(),
        placeId: place.id()
      },
    }).then(
      (success) => {console.log(success)},
      (rej) => console.error('Link tweet -> place', place.full_name(), tweet.content(), rej)
    )
);

export const linkPlaceToCountry = (db, place, country) => (
  db.query(
    'CREATE EDGE IN_COUNTRY FROM (SELECT FROM place WHERE id = :placeId) TO (SELECT FROM country WHERE code = :countryCode)',
    {
      params: {
        placeId: place.id(),
        countryCode: country.code(),
      },
    }).then(
      () => {},
      (rej) => console.error('Link place -> country', place.full_name(), country.name(), rej)
    )
);
