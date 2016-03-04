export const schema = [
  {
    'name': 'Tweet',
    'superclass': 'V',
    'properties': [
      ['content', 'String'],
      ['date', 'Datetime'],
      ['likes', 'Integer'],
      ['retweets', 'Integer'],
    ],
  },
  {
    'name': 'Tweeter',
    'superclass': 'V',
    'properties': [
      ['name', 'String'],
      ['handle', 'String'],
    ],
  },
];
