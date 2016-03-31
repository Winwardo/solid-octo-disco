import { should } from 'chai';
import { mostFrequentWords, mostFrequentUsers, groupedCountWords } from './tweetAnalysis';
should();

describe('#TweetAnalysis', () => {
  describe('Frequent words counter', () => {
    const exampleFrequentWords = [
      { word: 'three', count: 3 },
      { word: 'two', count: 2 },
      { word: 'one', count: 1 },
    ];

    it('returns an empty list on empty input', () => {
      const tweets = [];
      mostFrequentWords(tweets).should.deep.equal([]);
    });

    it('counts words in a single tweet, most frequent first', () => {
      const tweets = [{ content: 'one three two three two three' }];
      mostFrequentWords(tweets).should.deep.equal(exampleFrequentWords);
    });

    it('counts words across several tweets, most frequent first', () => {
      const tweets = [{ content: 'one two three three' }, { content: 'two three' }];
      mostFrequentWords(tweets).should.deep.equal(exampleFrequentWords);
    });

    it('ignores punctuation when splitting words', () => {
      const tweets = [{ content: 'one, two,two three.three !three' }];
      mostFrequentWords(tweets).should.deep.equal(exampleFrequentWords);
    });

    it('correctly identifies t.co URLS', () => {
      const tweets = [{ content: 'one, two three https://t.co/url1 https://t.co/url2 four https://t.co/url3' }];
      mostFrequentWords(tweets).should.deep.equal([
        { word: 'one', count: 1 },
        { word: 'two', count: 1 },
        { word: 'three', count: 1 },
        { word: 'https://t.co/url1', count: 1 },
        { word: 'https://t.co/url2', count: 1 },
        { word: 'four', count: 1 },
        { word: 'https://t.co/url3', count: 1 },
      ]);
    });

    it('can conflate words of different cases together with one word', () => {
      const exampleCountedAndSortedWords = [
        { word: 'football', count: 10 },
      ];

      groupedCountWords(exampleCountedAndSortedWords).should.deep.equal(
        [
          {
            word: 'football',
            count: 10,
            makeup: [
              { word: 'football', count: 10 },
            ],
          },
        ]
      );
    });

    it('can conflate words of different cases together with one uppercase word', () => {
      const exampleCountedAndSortedWords = [
        { word: 'FOOTBALL', count: 10 },
      ];

      groupedCountWords(exampleCountedAndSortedWords).should.deep.equal(
        [
          {
            word: 'football',
            count: 10,
            makeup: [
              { word: 'FOOTBALL', count: 10 },
            ],
          },
        ]
      );
    });

    it('can conflate words of different cases together with one uppercase word and one lower case', () => {
      const exampleCountedAndSortedWords = [
        { word: 'FOOTBALL', count: 10 },
        { word: 'football', count: 5 },
      ];

      groupedCountWords(exampleCountedAndSortedWords).should.deep.equal(
        [
          {
            word: 'football',
            count: 15,
            makeup: [
              { word: 'FOOTBALL', count: 10 },
              { word: 'football', count: 5 },
            ],
          },
        ]
      );
    });

    it('can conflate words of different cases together in a complex example', () => {
      const exampleCountedAndSortedWords = [
        { word: 'MANCHESTER', count: 16 },
        { word: 'football', count: 10 },
        { word: 'liverpool', count: 7 },
        { word: 'Football', count: 5 },
        { word: 'FOOTBALL', count: 5 },
      ];

      groupedCountWords(exampleCountedAndSortedWords).should.deep.equal(
        [
          {
            word: 'football',
            count: 20,
            makeup: [
              { word: 'football', count: 10 },
              { word: 'Football', count: 5 },
              { word: 'FOOTBALL', count: 5 },
            ],
          },
          {
            word: 'manchester',
            count: 16,
            makeup: [
              { word: 'MANCHESTER', count: 16 },
            ],
          },
          {
            word: 'liverpool',
            count: 7,
            makeup: [
              { word: 'liverpool', count: 7 },
            ],
          },
        ]
      );
    });
  });

  describe('Most active users counter', () => {
    it('returns an empty list on an empty input', () => {
      const tweets = [];
      mostFrequentUsers(tweets).should.deep.equal([]);
    });

    it('returns the Tweeter and their tweets', () => {
      const tweets = [
        {
          author: {
            id: 1,
            name: 'example',
            handle: 'exampleHandle',
          },
          data: { content: 'hello world' },
          source: 'twitter',
        }, {
          author: {
            id: 1,
            name: 'example',
            handle: 'exampleHandle',
          },
          data: { content: 'second tweet' },
          source: 'twitter',
        },
      ];
      mostFrequentUsers(tweets).should.deep.equal(
        [
          {
            author: {
              id: 1,
              name: 'example',
              handle: 'exampleHandle',
            },
            posts: [
              { content: 'hello world' },
              { content: 'second tweet' },
            ],
            source: 'twitter',
          },
        ]
      );
    });

    it('returns the Tweeter and their tweets, sorted by most active first', () => {
      const tweets = [
        {
          author: {
            id: 2,
            name: 'example2',
            handle: 'exampleHandle2',
          },
          data: { content: 'hello world' },
          source: 'twitter',
        }, {
          author: {
            id: 1,
            name: 'example',
            handle: 'exampleHandle',
          },
          data: { content: 'hey there' },
          source: 'twitter',
        }, {
          author: {
            id: 1,
            name: 'example',
            handle: 'exampleHandle',
          },
          data: { content: 'I am second' },
          source: 'twitter',
        }, {
          author: {
            id: 2,
            name: 'example2',
            handle: 'exampleHandle2',
          },
          data: { content: 'second tweet' },
          source: 'twitter',
        }, {
          author: {
            id: 3,
            name: 'example3',
            handle: 'exampleHandle3',
          },
          data: { content: 'I am third' },
          source: 'twitter',
        }, {
          author: {
            id: 2,
            name: 'example2',
            handle: 'exampleHandle2',
          },
          data: { content: 'I am first' },
          source: 'twitter',
        },
      ];
      mostFrequentUsers(tweets).should.deep.equal(
        [
          {
            author: {
              id: 2,
              name: 'example2',
              handle: 'exampleHandle2',
            },
            posts: [
              { content: 'hello world' },
              { content: 'second tweet' },
              { content: 'I am first' },
            ],
            source: 'twitter',
          },
          {
            author: {
              id: 1,
              name: 'example',
              handle: 'exampleHandle',
            },
            posts: [
              { content: 'hey there' },
              { content: 'I am second' },
            ],
            source: 'twitter',
          },
          {
            author: {
              id: 3,
              name: 'example3',
              handle: 'exampleHandle3',
            },
            posts: [
              { content: 'I am third' },
            ],
            source: 'twitter',
          },
        ]
      );
    });
  });
});
