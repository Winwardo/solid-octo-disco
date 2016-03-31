import { flattenImmutableObject } from '../utilities';

const runQueryOnImmutableObject = (db, query, objectToFlatten) =>
  db.query(query, { params: flattenImmutableObject(objectToFlatten) });

export const upsertTweeter = (db, tweeter) => (
  runQueryOnImmutableObject(
    db,
    'UPDATE tweeter SET id=:id, name=:name, handle=:handle UPSERT WHERE id=:id',
    tweeter
  ).then(() => {}, (rej) => { console.error('Upsert tweeter', rej); })
);

export const upsertTweet = (db, tweet) => (
  runQueryOnImmutableObject(
    db,
    'UPDATE tweet SET id=:id, content=:content, date=:date, likes=:likes, retweets=:retweets, longitude=:longitude, latitude=:latitude UPSERT WHERE id=:id',
    tweet
  ).then(() => {}, (rej) => { console.error('Upsert tweet', rej); })
);

export const upsertHashtag = (db, hashtag) => (
  runQueryOnImmutableObject(
    db,
    'UPDATE hashtag SET content=:content UPSERT WHERE content=:content',
    hashtag
  ).then(() => {}, (rej) => { console.error('Upsert hashtag', rej); })
);

export const upsertPlace = (db, place) => (
  runQueryOnImmutableObject(
    db,
    'UPDATE place SET id=:id, name=:name, full_name=:full_name, type=:type UPSERT WHERE id=:id',
    place
  ).then(() => {}, (rej) => console.error('Upsert place', rej))
);

export const upsertCountry = (db, country) => (
  runQueryOnImmutableObject(
    db,
    'UPDATE country SET code=:code, name=:name UPSERT WHERE code=:code',
    country
  ).then(() => {}, (rej) => {console.error('Upsert country', rej);})
);

export const linkTweeterToTweet = (db, tweeter, tweet) => (
  db.query(
    'CREATE EDGE TWEETED FROM (SELECT FROM tweeter WHERE id = :tweeterId) TO (SELECT FROM tweet WHERE id = :tweetId)',
    {
      params: {
        tweetId: tweet.id(),
        tweeterId: tweeter.id(),
      },
    }).then(
      () => {},
      (rej) => expectRejection(rej, 'TWEETED.in_out', 'tweeter', 'tweet'),
    )
);

export const linkTweeterToRetweet = (db, tweeter, tweet) => (
  db.query(
    'CREATE EDGE RETWEETED FROM (SELECT FROM tweeter WHERE id = :tweeterId) TO (SELECT FROM tweet WHERE id = :tweetId)',
    {
      params: {
        tweetId: tweet.id(),
        tweeterId: tweeter.id(),
      },
    }).then(() => {}, (rej) => { console.error('Link tweeter -> retweet', rej); })
);

export const linkTweetToHashtag = (db, tweet, hashtag) => (
  db.query(
    'CREATE EDGE HAS_HASHTAG FROM (SELECT FROM tweet WHERE id = :tweetId) TO (SELECT FROM hashtag WHERE content = :hashtagContent)',
    {
      params: {
        tweetId: tweet.id(),
        hashtagContent: hashtag.content(),
      },
    }).then(
      () => {},
      (rej) => expectRejection(rej, 'HAS_HASHTAG.in_out', 'tweet', 'hashtag'),
    )
);

export const linkTweetToTweeterViaMention = (db, tweet, mentionedTweeter) => (
  db.query(
    'CREATE EDGE MENTIONS FROM (SELECT FROM tweet WHERE id = :tweetId) TO (SELECT FROM tweeter WHERE id = :mentionedTweeterId)',
    {
      params: {
        tweetId: tweet.id(),
        mentionedTweeterId: mentionedTweeter.id(),
      },
    }).then(
      () => {},
      (rej) => expectRejection(rej, 'MENTIONS.in_out', 'tweet', 'mentioned tweeter'),
    )
);

export const linkTweetToPlace = (db, tweet, place) => (
  db.query(
    'CREATE EDGE HAS_PLACE FROM (SELECT FROM tweet WHERE id = :tweetId) TO (SELECT FROM place WHERE id = :placeId)',
    {
      params: {
        tweetId: tweet.id(),
        placeId: place.id(),
      },
    }).then(
      () => {},
      (rej) => expectRejection(rej, 'HAS_PLACE.in_out', 'tweet', 'place'),
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
      (rej) => expectRejection(rej, 'IN_COUNTRY.in_out', 'place', 'country'),
    )
);

const expectRejection = (rejection, expect, from, to) => {
  if (rejection.message.indexOf(expect) > -1) {
    console.info('Tweet already linked to hashtag.');
  } else {
    console.error(`Unexpected error linking ${from} => ${to}.`, rejection);
  }
};
