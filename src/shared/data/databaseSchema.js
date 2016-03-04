export const schema = {
  'Tweet': {
    'superclass': 'V',
    'properties': [
      ['id', 'Integer'],
      ['content', 'String'],
      ['date', 'Datetime'],
      ['likes', 'Integer'],
      ['retweets', 'Integer'],
    ],
  },
  'Tweeter': {
    'superclass': 'V',
    'properties': [
      ['name', 'String'],
      ['handle', 'String'],
    ],
  },
  'TWEETED': {
    'superclass': 'E',
    'properties': [],
  },
};
