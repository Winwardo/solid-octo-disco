require('chai').should();
TweetAnalysis = require('./tweetAnalysis');

describe('#TweetAnalysis', () => {
  describe('Frequent words counter', () => {
    it('returns an empty list on empty input', () => {
      const tweets = [];
      TweetAnalysis.mostFrequentWords(tweets).should.deep.equal([]);
    });

    it('counts words in a single tweet, most frequent first', () => {
      const tweets = [{ 'content': 'one two two three three three' }];
      TweetAnalysis.mostFrequentWords(tweets).should.deep.equal([
        { 'word':'three', 'count': 3 },
        { 'word': 'two', 'count': 2 },
        { 'word': 'one', 'count': 1 },
      ]);
    });

    it('counts words across several tweets, most frequent first', () => {
      const tweets = [{ 'content': 'one two three three' }, { 'content': 'two three' }];
      TweetAnalysis.mostFrequentWords(tweets).should.deep.equal([
        { 'word':'three', 'count': 3 },
        { 'word': 'two', 'count': 2 },
        { 'word': 'one', 'count': 1 },
      ]);
    });

    it('ignores punctuation when splitting words', () => {
      const tweets = [{ 'content': 'one, two,two three.three !three' }];
      TweetAnalysis.mostFrequentWords(tweets).should.deep.equal([
        { 'word':'three', 'count': 3 },
        { 'word': 'two', 'count': 2 },
        { 'word': 'one', 'count': 1 },
      ]);
    });

  });

  describe('Most active users counter', () => {
    it('returns an empty list on an empty input', () => {
      const tweets = [];
      TweetAnalysis.mostActiveUsers(tweets).should.deep.equal([]);
    });

    it('returns the Tweeter and their tweets', () => {
      const tweets = [
        { 'tweeter': 1, 'content': 'hello world' },
        { 'tweeter': 1, 'content': 'second tweet' },
      ];
      TweetAnalysis.mostActiveUsers(tweets).should.deep.equal(
        [
        { 'tweeter': 1, 'tweets': [
          { 'tweeter': 1, 'content': 'hello world' },
          { 'tweeter': 1, 'content': 'second tweet' },
        ], },
      ]
      );
    });

  });
});
