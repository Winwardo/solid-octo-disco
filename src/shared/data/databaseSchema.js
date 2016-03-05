const Integer = 'Integer';
const String = 'String';
const Datetime = 'Datetime';

const Edge = 'E';
const Vertex = 'V';

const None = [];

const EmptyEdge = {
  'superclass': Edge,
  'properties': None,
};

export const schema = {
  'Tweet': {
    'superclass': Vertex,
    'properties': [
      ['id', Integer],
      ['content', String, true],
      ['date', Datetime],
      ['likes', Integer],
      ['retweets', Integer],
    ],
  },
  'Tweeter': {
    'superclass': Vertex,
    'properties': [
      ['id', Integer],
      ['name', String, true],
      ['handle', String],
    ],
  },
  'Hashtag': {
    'superclass': Vertex,
    'properties': [
      ['content', String, true],
    ],
  },
  'TWEETED': EmptyEdge,
  'RETWEETED': EmptyEdge,
  'FOLLOWS': EmptyEdge,
  'MENTIONS': EmptyEdge,
  'HAS_HASHTAG': EmptyEdge,
};
