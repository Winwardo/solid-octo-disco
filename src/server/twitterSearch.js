var Twit = require('twit')

// These keys should be hidden in a private config file or environment variables
// For simplicity of this assignment, they will be visible here
var T = new Twit({
  consumer_key:         'YiSLB0kOlsTd21UGYT32YOUgg',
  consumer_secret:      '78b5VrGzkcIkpmftLdlFwirraelPRq2t5bFlgEcMkfaQqQh1Mb',
  access_token:         '1831536590-kX7HPRraGcbs5t9xz1wg0QdsvbOAW4pFK5L0Y68',
  access_token_secret:  'ceYqZAulg2MT89Jw11rA44FOwHOFcEccFv9HXFIG9ckJf',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
});

module.exports = {
  'test': () => {
    T.get('search/tweets', { q: 'banana since:2011-07-11', count: 100 }, function(err, data, response) {
      console.log(data);
      return data;
    })
  }
}