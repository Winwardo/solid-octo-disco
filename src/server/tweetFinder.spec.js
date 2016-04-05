import { should } from 'chai';
import * as tweetFinder from './tweetFinder';

describe('#TweetFinder', () => {
  describe('Unioning tweets', () => {
    it('should return an empty list given an empty list', () => {
      const inputResultList = [];
      const expected = [];

      tweetFinder.unionTweets(inputResultList).should.deep.equals(expected);
    });

    it('should return the identity of a single resultlist', () => {
      const inputResultList = [[makeTweetWithId(10)]];
      const expected = [makeTweetWithId(10)];

      tweetFinder.unionTweets(inputResultList).should.deep.equals(expected);
    });

    it('should append two unique lists together', () => {
      const inputResultList = [[makeTweetWithId(10)], [makeTweetWithId(33)]];
      const expected = [makeTweetWithId(10), makeTweetWithId(33)];

      tweetFinder.unionTweets(inputResultList).should.deep.equals(expected);
    });

    it('should union two non-unique lists together', () => {
      const inputResultList = [[makeTweetWithId(10), makeTweetWithId(50)], [makeTweetWithId(33), makeTweetWithId(50)]];
      const expected = [makeTweetWithId(10), makeTweetWithId(33), makeTweetWithId(50)];

      tweetFinder.unionTweets(inputResultList).should.deep.equals(expected);
    });

    const makeTweetWithId = (id, content='Hello world') => ({ tweet: { id: id, content: content } });

  });
});

describe('#QueryNormaliser', () => {
  it('leaves short single terms alone', () => {
    tweetFinder.normaliseQueryTerm('hi').should.equal('hi');
  });

  it('fuzzes longer single terms', () => {
    tweetFinder.normaliseQueryTerm('manchester').should.equal('manchester~');
  });

  it('surrounds multiple term queries in quotes', () => {
    tweetFinder.normaliseQueryTerm('manchester united').should.equal('"manchester united"');
  });
})
