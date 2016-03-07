import { db } from './orientdb';
import { TweetBuilder, TweeterBuilder } from '../shared/data/databaseObjects';
import { chainPromises, flattenImmutableObject } from '../shared/utilities';
import { TwitAccess, processTweet } from './twitterSearch';
//import { Promise } from 'bluebird';

/**
 * Grab all tweets from the database, and show them with their authors.
 * @deprecated
 * @param response
 */
export const exampleDatabaseCall = (request, response) => {
  db.query('SELECT FROM tweet WHERE content LUCENE :query LIMIT 20',
    {
      'params': {
        'query': request.params.query + '~',
      },
    })
    .then((tweetRecords) => {
      const result = [];

      const promises = tweetRecords.map((tweetRecord) => {
        const rid = '' + tweetRecord['@rid'];

        return db.query(
          `SELECT FROM (TRAVERSE in(TWEETED) FROM (SELECT FROM ${rid})) WHERE @class = "Tweeter"`
          )
          .then((tweeterRecords) => {
            const tweeterRecord = tweeterRecords[0];
            const toReturn = {
              'tweet':
                flattenImmutableObject(
                  TweetBuilder()
                    .id(tweetRecord.id)
                  .content(tweetRecord.content)
                  .date(tweetRecord.date.toISOString())
                  .likes(tweetRecord.likes)
                  .retweets(tweeterRecord.retweets)
                  .build()),
              'tweeter':
                flattenImmutableObject(
                  TweeterBuilder()
                    .id(tweeterRecord.id)
                  .name(tweeterRecord.name)
                  .handle(tweeterRecord.handle)
                  .build()),
            };

            result.push(toReturn);
          });
      });

      Promise.all(promises)
        .then(() => {
          response.end(
            JSON.stringify(
              result));
        });

    })
    .error((error) => {
      console.error('Major issues abound.');
      response.end('Unable to connect to database.');
    });
};

const buildTweetFromDatabaseRecord = (record) => {
  return TweetBuilder()
    .id(record.id)
    .content(record.content)
    .date(record.date.toISOString())
    .likes(record.likes)
    .retweets(record.retweets)
    .build();
};

export const searchQuery = (req, res, secondary = false) => {
  return doQuery(req.body[0].query, [])
    .then((data) => {
      res.end(JSON.stringify(data));
    });
}

const doQuery = (query, results, secondary = false) => {
  //console.log(query);

  //let results = [];
  // First do an initial search of our database for relevant Tweets
  const tweetSelection = 'SELECT FROM tweet WHERE content LUCENE :query ORDER BY date DESC LIMIT 300';

  return chainPromises(() => {
    return db.query(tweetSelection, {'params': {'query': query + '~'}});
  })
  .then((tweetRecords) => {
    //console.log(tweetRecords);

    if (!secondary && tweetRecords.length <= 100) {


      console.log("SCRAPEY TWITTEROO")
      // no relevant results, search Twitter
      return TwitAccess.get('search/tweets', { 'q': query, 'count': 300 })
      .then((data) => {
        console.log("tweets:", data.data.statuses.length)
        //console.log(data)
        return Promise.all(
          data.data.statuses.map((rawTweet, id) => {
            //console.log("text", rawTweet.text, id)
            return processTweet(db, rawTweet, id);
          })
        );

        //return chainPromises(() => {
        //  return {'thing': 'stuff'};
        //});
      })
      .then(
        (data) => {

        console.log("OKAY SCRAPED TWITTER ")
        //console.log(data.resp)
        //console.log(Object.keys(data))
        return doQuery(query, results, true);

        return chainPromises(() => {
          return {'thing': 'stuff'};
        },
          (rej) => {
            console.log("REJECTED", rej);
          }
        )
      });



    } else {

      console.log("MAGIC")
      // relevant results, see if they're good enough

      // probably so, just splat them out
      const thing = tweetRecords.map((tweetRecord) => {
        return flattenImmutableObject(buildTweetFromDatabaseRecord(tweetRecord));
      });
      Array.prototype.push.apply(results, thing);



    }
  })
  .then(() => {
    return {
        'data': {
          'count': results.length,
          'tweets': results
        }
      }
  })

}
