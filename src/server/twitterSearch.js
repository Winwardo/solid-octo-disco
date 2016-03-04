var Twit = require('twit');
import { exampleSearch } from './exampleSearch';
import { db } from './orientdb';

// These keys should be hidden in a private config file or environment variables
// For simplicity of this assignment, they will be visible here
var T = new Twit({
  consumer_key:         'YiSLB0kOlsTd21UGYT32YOUgg',
  consumer_secret:      '78b5VrGzkcIkpmftLdlFwirraelPRq2t5bFlgEcMkfaQqQh1Mb',
  access_token:         '1831536590-kX7HPRraGcbs5t9xz1wg0QdsvbOAW4pFK5L0Y68',
  access_token_secret:  'ceYqZAulg2MT89Jw11rA44FOwHOFcEccFv9HXFIG9ckJf',
  timeout_ms:           60 * 1000,  // optional HTTP request timeout to apply to all requests.
});

 export const test = (res) => {
    //T.get('search/tweets', { q: 'manchester since:2011-07-11', count: 10 }, function (err, data, response) {
    //  console.log(data);
    //  res.end(JSON.stringify(data));
    //});
   exampleSearch.statuses.forEach((status) => {
     const user = status.user;

     db.query('UPDATE tweeter SET name=:name, handle=:handle UPSERT WHERE handle=:handle',
       {
         'params': {
          'name': user.name,
           'handle': user.screen_name
         }
       }).then((result) => {
       db.query('UPDATE tweet SET id=:id, content=:content, date=:date, likes=:likes, retweets=:retweets UPSERT WHERE id=:id',
         {
           'params': {
             'id': status.id,
             'content': status.text,
             'date': new Date(status.created_at),
             'likes': status.favourite_count || 0,
             'retweets': status.retweet_count || 0
           }
         }).then((result) => {
         console.log("Ready to join")
         db.query('CREATE EDGE TWEETED FROM (SELECT FROM tweeter WHERE handle = :tweeterHandle) TO (SELECT FROM tweet WHERE id = :tweetId)',
           {
             'params': {
               'tweetId': status.id,
               'tweeterHandle': user.screen_name
             }
           }).then((r) => {
           console.log("Made link")

         }).error((e) => {
           "use strict";
           console.log("did not make link")
           console.log(e)
         })
       });
     }).error((error) => {
       console.warn("ERROR")
       console.log(error)
     });

   })

   res.end(JSON.stringify(exampleSearch));
  };