const Integer = 'Integer';
const String = 'String';
const Datetime = 'Datetime';

const Edge = 'E';
const Vertex = 'V';

const None = [];

export const schema = {
  'Tweet': {
    'superclass': Vertex,
    'properties': [
      ['id', Integer],
      ['content', String],
      ['date', Datetime],
      ['likes', Integer],
      ['retweets', Integer],
    ],
  },
  'Tweeter': {
    'superclass': Vertex,
    'properties': [
      ['name', String],
      ['handle', String],
    ],
  },
  'TWEETED': {
    'superclass': Edge,
    'properties': None,
  },
  'MENTIONED': {
    'superclass': Edge,
    'properties': None,
  },
};
