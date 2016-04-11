import { flattenImmutableObject, newPromiseChain } from '../utilities';

const runQueryOnImmutableObject = (db, query, objectToFlatten) =>
  db.query(query, { params: flattenImmutableObject(objectToFlatten) });

export const upsertTweeter = (db, tweeter) => {
  // This is more complex than the other upsert queries
  // First check if our Tweeter already exists in the database
  // If they do, ONLY overwrite their current information, if the
  // new information is complete, e.g. isn't from a mention
  // and therefore has profile image information
  const checkQuery = 'SELECT FROM tweeter WHERE id=:id';

  const update = 'UPDATE tweeter SET id=:id, name=:name, handle=:handle, profile_image_url=:profile_image_url, is_user_mention=:is_user_mention, is_verified=:is_verified WHERE id=:id';
  const upsert = 'UPDATE tweeter SET id=:id, name=:name, handle=:handle, profile_image_url=:profile_image_url, is_user_mention=:is_user_mention, is_verified=:is_verified UPSERT WHERE id=:id';

  return newPromiseChain()
    .then(() => runQueryOnImmutableObject(db, checkQuery, tweeter))
    .then(
      (response) => {
        if (response.length === 1) { // Do we have this author already?
          if (!tweeter.is_user_mention()) { // Is it worth updating?
            return runQueryOnImmutableObject(db, update, tweeter);
          }
        } else {
          // We can't find the user, so upsert them
          return runQueryOnImmutableObject(db, upsert, tweeter);
        }
      }
    )
    .then(() => {}, (rej) => { console.error('Upsert tweeter', rej); });
};

export const upsertTweet = (db, tweet) => (
  runQueryOnImmutableObject(
    db,
    'UPDATE tweet SET id=:id, content=:content, date=:date, likes=:likes, retweets=:retweets, longitude=:longitude, latitude=:latitude, contains_a_quoted_tweet=:contains_a_quoted_tweet, image_url=:image_url UPSERT WHERE id=:id',
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
    }).then(
    () => {},
    (rej) => expectRejection(rej, 'RETWEETED.in_out', 'tweeter', 'retweet'),
  )
);

export const linkQuoteTweetToOriginalTweet = (db, quoteTweet, originalTweet) => (
  db.query(
    'CREATE EDGE QUOTED FROM (SELECT FROM tweet WHERE id = :quoteTweetId) TO (SELECT FROM tweet WHERE id = :originalTweetId)',
    {
      params: {
        quoteTweetId: quoteTweet.id(),
        originalTweetId: originalTweet.id(),
      },
    }).then(
    () => {},
    (rej) => expectRejection(rej, 'QUOTED.in_out', 'quoteTweet', 'quotedTweet')
  )
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
  if (rejection.message.indexOf(expect) === -1) {
    console.error(`Unexpected error linking ${from} => ${to}.`, rejection);
  }
};
