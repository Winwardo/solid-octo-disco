require('chai').should();
TweetAnalysis = require('./tweetAnalysis');

describe('#TweetAnalysis', () => {
  describe('Frequent words counter', () => {
    it('returns an empty list on empty input', () => {
      const tweets = [];
      TweetAnalysis.mostFrequentWords(tweets).should.deep.equal([]);
    });
  });
});
