const Integer = 'Integer';
const String = 'String';
const Datetime = 'Datetime';

const Edge = 'E';
const Vertex = 'V';

const None = [];

const NO_INDEX = 'none';
const LUCENE = 'FULLTEXT ENGINE LUCENE';

const EmptyEdge = {
  'superclass': Edge,
  'properties': None,
};

export const schema = {
  'Tweet': {
    'superclass': Vertex,
    'properties': [
      { 'name': 'id', 'type': Integer, 'index': NO_INDEX },
      { 'name': 'content', 'type': String, 'index': LUCENE },
      { 'name': 'date', 'type': Datetime, 'index': NO_INDEX },
      { 'name': 'likes', 'type': Integer, 'index': NO_INDEX },
      { 'name': 'retweets', 'type': Integer, 'index': NO_INDEX },
    ],
  },
  'Tweeter': {
    'superclass': Vertex,
    'properties': [
      { 'name': 'id', 'type': Integer, 'index': NO_INDEX },
      { 'name': 'name', 'type': String, 'index': LUCENE },
      { 'name': 'handle', 'type': String, 'index': NO_INDEX },
    ],
  },
  'Hashtag': {
    'superclass': Vertex,
    'properties': [
      { 'name': 'content', 'type': String, 'index': LUCENE },
    ],
  },
  'TWEETED': EmptyEdge,
  'RETWEETED': EmptyEdge,
  'FOLLOWS': EmptyEdge,
  'MENTIONS': EmptyEdge,
  'HAS_HASHTAG': EmptyEdge,
};
