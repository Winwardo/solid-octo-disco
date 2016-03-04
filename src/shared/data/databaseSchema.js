export const schema = {
  'Tweet': {
    'superclass': 'V',
    'properties': [
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
};
