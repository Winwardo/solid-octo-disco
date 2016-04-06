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

describe('#QueryBuilder', () => {
  const makeQuery = (term, paramTypes) => {
    const result = {
      query: term,
      paramTypes: [],
    };
    for (const paramTypeName of paramTypes) {
      result.paramTypes.push({
        name: paramTypeName,
        selected: true,
      });
    }
    return result;
  };

  it('should return the empty array for an empty array', () => {
    tweetFinder.buildTwitterQuery([]).should.deep.equal([]);
  });

  it('should build a single Twitter query for a single search query', () => {
    tweetFinder.buildTwitterQuery(
      [
        makeQuery('arsenal', ['keyword', 'author', 'hashtag', 'mention']),
      ]
    ).should.deep.equal(
      [
        '"arsenal" OR @arsenal OR #arsenal',
      ]
    );
  });

  it('should build a single Twitter query for a single search query with differently ordered paraas', () => {
    tweetFinder.buildTwitterQuery(
      [
        makeQuery('arsenal', ['hashtag', 'keyword', 'author', 'mention']),
      ]
    ).should.deep.equal(
      [
        '#arsenal OR "arsenal" OR @arsenal',
      ]
    );
  });

  it('should remove spaces in authors/mentions and hashtags', () => {
    tweetFinder.buildTwitterQuery(
      [
        makeQuery('manchester united', ['keyword', 'author', 'hashtag', 'mention']),
      ]
    ).should.deep.equal(
      [
        '"manchester united" OR @manchesterunited OR #manchesterunited',
      ]
    );
  });

  it('should build a single Twitter query for a multiple search query', () => {
    tweetFinder.buildTwitterQuery(
      [
        makeQuery('arsenal', ['keyword', 'author', 'hashtag', 'mention']),
        makeQuery('spurs', ['keyword', 'author', 'hashtag', 'mention']),
      ]
    ).should.deep.equal(
      [
        '"arsenal" OR @arsenal OR #arsenal OR "spurs" OR @spurs OR #spurs',
      ]
    );
  });

  it('should build two Twitter queries for a large multiple search query, splitting on query term', () => {
    tweetFinder.buildTwitterQuery(
      [
        makeQuery('arsenal', ['keyword', 'author', 'hashtag', 'mention']),
        makeQuery('spurs', ['keyword', 'author', 'hashtag', 'mention']),
        makeQuery('manchester', ['keyword', 'author', 'hashtag', 'mention']),
        makeQuery('liverpool', ['keyword', 'author', 'hashtag', 'mention']),
      ]
    ).should.deep.equal(
      [
        '"arsenal" OR @arsenal OR #arsenal OR "spurs" OR @spurs OR #spurs OR "manchester" OR @manchester OR #manchester',
        '"liverpool" OR @liverpool OR #liverpool',
      ]
    );
  });

  it('should be able to search just keywords', () => {
    tweetFinder.buildTwitterQuery(
      [
        makeQuery('arsenal', ['keyword']),
      ]
    ).should.deep.equal(
      [
        '"arsenal"',
      ]
    );
  });

  it('should be able to search just hashtags', () => {
    tweetFinder.buildTwitterQuery(
      [
        makeQuery('arsenal', ['hashtag']),
      ]
    ).should.deep.equal(
      [
        '#arsenal',
      ]
    );
  });

  it('should conflate mention and author', () => {
    tweetFinder.buildTwitterQuery(
      [
        makeQuery('arsenal', ['mention']),
        makeQuery('spurs', ['author']),
      ]
    ).should.deep.equal(
      [
        '@arsenal OR @spurs',
      ]
    );
  });
});
