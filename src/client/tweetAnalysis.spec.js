import { should } from 'chai';
import { mostFrequentWords, mostActiveUsers, groupedCountWords } from './tweetAnalysis';
should();

describe('#TweetAnalysis', () => {
  describe('Frequent words counter', () => {
    const exampleFrequentWords = [
      { 'word': 'three', 'count': 3 },
      { 'word': 'two', 'count': 2 },
      { 'word': 'one', 'count': 1 },
    ];

    it('returns an empty list on empty input', () => {
      const tweets = [];
      mostFrequentWords(tweets).should.deep.equal([]);
    });

    it('counts words in a single tweet, most frequent first', () => {
      const tweets = [{ 'content': 'one three two three two three' }];
      mostFrequentWords(tweets).should.deep.equal(exampleFrequentWords);
    });

    it('counts words across several tweets, most frequent first', () => {
      const tweets = [{ 'content': 'one two three three' }, { 'content': 'two three' }];
      mostFrequentWords(tweets).should.deep.equal(exampleFrequentWords);
    });

    it('ignores punctuation when splitting words', () => {
      const tweets = [{ 'content': 'one, two,two three.three !three' }];
      mostFrequentWords(tweets).should.deep.equal(exampleFrequentWords);
    });

    it('can conflate words of different cases together with one word', () => {
      const exampleCountedAndSortedWords = [
        { 'word': 'football', 'count': 10 },
      ];

      groupedCountWords(exampleCountedAndSortedWords).should.deep.equal(
        [
          {
            'word': 'football',
            'count': 10,
            'makeup': [
              { 'word': 'football', 'count': 10 },
            ],
          },
        ]
      );
    });

    it('can conflate words of different cases together with one uppercase word', () => {
      const exampleCountedAndSortedWords = [
        { 'word': 'FOOTBALL', 'count': 10 },
      ];

      groupedCountWords(exampleCountedAndSortedWords).should.deep.equal(
        [
          {
            'word': 'football',
            'count': 10,
            'makeup': [
              { 'word': 'FOOTBALL', 'count': 10 },
            ],
          },
        ]
      );
    });

    it('can conflate words of different cases together with one uppercase word and one lower case', () => {
      const exampleCountedAndSortedWords = [
        { 'word': 'FOOTBALL', 'count': 10 },
        { 'word': 'football', 'count': 5 },
      ];

      groupedCountWords(exampleCountedAndSortedWords).should.deep.equal(
        [
          {
            'word': 'football',
            'count': 15,
            'makeup': [
              { 'word': 'FOOTBALL', 'count': 10 },
              { 'word': 'football', 'count': 5 },
            ],
          },
        ]
      );
    });

    it('can conflate words of different cases together in a complex example', () => {
      const exampleCountedAndSortedWords = [
        { 'word': 'MANCHESTER', 'count': 16 },
        { 'word': 'football', 'count': 10 },
        { 'word': 'liverpool', 'count': 7 },
        { 'word': 'Football', 'count': 5 },
        { 'word': 'FOOTBALL', 'count': 5 },
      ];

      groupedCountWords(exampleCountedAndSortedWords).should.deep.equal(
        [
          {
            'word': 'football',
            'count': 20,
            'makeup': [
              { 'word': 'football', 'count': 10 },
              { 'word': 'Football', 'count': 5 },
              { 'word': 'FOOTBALL', 'count': 5 },
            ],
          },
          {
            'word': 'manchester',
            'count': 16,
            'makeup': [
              { 'word': 'MANCHESTER', 'count': 16 },
            ],
          },
          {
            'word': 'liverpool',
            'count': 7,
            'makeup': [
              { 'word': 'liverpool', 'count': 7 },
            ],
          },
        ]
      );
    });
  });

  describe('Most active users counter', () => {
    it('returns an empty list on an empty input', () => {
      const tweets = [];
      mostActiveUsers(tweets).should.deep.equal([]);
    });

    it('returns the Tweeter and their tweets', () => {
      const tweets = [
        { 'tweeter': 1, 'content': 'hello world' },
        { 'tweeter': 1, 'content': 'second tweet' },
      ];
      mostActiveUsers(tweets).should.deep.equal(
        [
          {
            'tweeter': 1,
            'tweets': [
              { 'tweeter': 1, 'content': 'hello world' },
              { 'tweeter': 1, 'content': 'second tweet' },
            ],
          },
        ]
      );
    });

    it('returns the Tweeter and their tweets, sorted by most active first', () => {
      const tweets = [
        { 'tweeter': 1, 'content': 'hey there' },
        { 'tweeter': 2, 'content': 'hello world' },
        { 'tweeter': 1, 'content': 'im second' },
        { 'tweeter': 2, 'content': 'second tweet' },
        { 'tweeter': 3, 'content': 'im third' },
        { 'tweeter': 2, 'content': 'im first' },
      ];
      mostActiveUsers(tweets).should.deep.equal(
        [
          {
            'tweeter': 2,
            'tweets': [
              { 'tweeter': 2, 'content': 'hello world' },
              { 'tweeter': 2, 'content': 'second tweet' },
              { 'tweeter': 2, 'content': 'im first' },
            ],
          },
          {
            'tweeter': 1,
            'tweets': [
              { 'tweeter': 1, 'content': 'hey there' },
              { 'tweeter': 1, 'content': 'im second' },
            ],
          },
          {
            'tweeter': 3,
            'tweets': [
              { 'tweeter': 3, 'content': 'im third' },
            ],
          },
        ]
      );
    });

  });
});
