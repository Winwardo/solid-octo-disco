const Boolean = 'Boolean';
const Datetime = 'Datetime';
const Double = 'Double';
const Integer = 'Integer';
const String = 'String';

const Edge = 'E';
const Vertex = 'V';

const None = [];

const LUCENE = 'FULLTEXT ENGINE LUCENE';
const UNIQUE = 'UNIQUE';

const EmptyEdge = {
  superclass: Edge,
  properties: [
    { name: 'in', type: 'LINK' },
    { name: 'out', type: 'LINK' },
  ],
  indexes: [
    { properties: ['in', 'out'], type: UNIQUE, },
  ],
};

export const schema = {
  Tweet: {
    superclass: Vertex,
    properties: [
      { name: 'id', type: String },
      { name: 'content', type: String },
      { name: 'date', type: Datetime },
      { name: 'likes', type: Integer },
      { name: 'retweets', type: Integer },
      { name: 'longitude', type: Double },
      { name: 'latitude', type: Double },
    ],
    indexes: [
      { properties: ['content'], type: LUCENE, },
    ],
  },
  Tweeter: {
    superclass: Vertex,
    properties: [
      { name: 'id', type: String },
      { name: 'name', type: String },
      { name: 'handle', type: String },
      { name: 'profile_image_url', type: String },
      { name: 'is_user_mention', type: Boolean },
    ],
    indexes: [
      { properties: ['name'], type: LUCENE, },
      { properties: ['handle'], type: LUCENE, },
    ],
  },
  Hashtag: {
    superclass: Vertex,
    properties: [
      { name: 'content', type: String },
    ],
    indexes: [
      { properties: ['content'], type: LUCENE, },
    ],
  },
  Place: {
    superclass: Vertex,
    properties: [
      { name: 'id', type: String },
      { name: 'name', type: String },
      { name: 'full_name', type: String },
      { name: 'type', type: String },
    ],
    indexes: [
      { properties: ['full_name'], type: LUCENE, },
    ],
  },
  Country: {
    superclass: Vertex,
    properties: [
      { name: 'code', type: String },
      { name: 'name', type: String },
    ],
    indexes: [
      { properties: ['name'], type: LUCENE, },
    ],
  },
  TWEETED: EmptyEdge,
  RETWEETED: EmptyEdge,
  FOLLOWS: EmptyEdge,
  MENTIONS: EmptyEdge,
  HAS_HASHTAG: EmptyEdge,
  HAS_PLACE: EmptyEdge,
  IN_COUNTRY: EmptyEdge,
};
