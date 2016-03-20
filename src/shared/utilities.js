import fetch from 'isomorphic-fetch';

/**
 * Converts an object of style {'a': {'b': c}, 'd': {'e': f}} to [{'b': c}, {'e': f}]
 * @param {Object} givenObject Any object.
 * @returns {Array}
 */
export const flattenObjectToArray = (givenObject) => {
  const result = [];
  for (const key in givenObject) {
    if (givenObject.hasOwnProperty(key)) {
      result.push(givenObject[key]);
    }
  }

  return result;
};

/**
 * Converts an immutable object (one with purely getter methods) to a plain key/value
 * object, by calling the functions and storing the result.
 * @param givenObject Similar to {'name': () => { return 'John'; }}
 * @returns {{}} Similar to {'name': 'John'}
 */
export const flattenImmutableObject = (givenObject) => {
  if (typeof givenObject !== 'object') { return givenObject; }

  const result = {};
  for (const key in givenObject) {
    if (givenObject.hasOwnProperty(key)) {
      const field = givenObject[key];

      if (typeof field === 'function') {
        result[key] = flattenImmutableObject(field());
      } else {
        result[key] = field;
      }
    }
  }

  return result;
};

/**
 * Starts a new Promise chain, resolving immediately.
 * @param callback Must return a Promise.
 * @returns {Promise}
 */
export const chainPromises = (callback) => (
  new Promise((resolve) => {
    resolve(callback());
  })
);

/**
 * Generates the boilerplate headers for a JSON POST request
 * @param body The body of the request, e.g. {'query': 'liverpool'}
 * @returns {{method: string, headers: {Accept: string, Content-Type: string}, body: *}}
 */
export const makePostHeader = (body) => {
  if (typeof body === 'object') {
    body = JSON.stringify(body);
  }

  return {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body,
  };
};

/**
 * Creates a JSON POST fetch promise with a given url and body
 * @param url Where to POST, e.g. '/search'
 * @param body The body of the request, e.g. {'query': 'liverpool'}
 */
export const fetchPost = (url, body) => (
  fetch(url, makePostHeader(body))
);

/**
 * Creates the paramTypes for a Twitter specific search term.
 * @param array of strings representing search paramaterTypes
 * @returns array of objects representing search terms with meta data
 */
export const createTwitterParamTypes = (paramTypesText) => [{
  name: 'author',
  selected: paramTypesText.indexOf('author') > -1,
  icon: getParamTypeIcon('author')
}, {
  name: 'hashtag',
  selected: paramTypesText.indexOf('hashtag') > -1,
  icon: getParamTypeIcon('hashtag')
}, {
  name: 'keyword',
  selected: paramTypesText.indexOf('keyword') > -1,
  icon: getParamTypeIcon('keyword')
}, {
  name: 'mention',
  selected: paramTypesText.indexOf('mention') > -1,
  icon: getParamTypeIcon('mention')
}];

/**
 * Returns a semantic icon name or character to represent seachParamTypes
 * eg. hashtag = #, mention = @
 * @param string which represents a paramtype
 * @returns char or string representing paramType (could be semantic icon class)
 */
const getParamTypeIcon = (paramType) => {
  switch (paramType) {
  case 'author':
    return 'user icon';
  case 'hashtag':
    return '#';
  case 'keyword':
    return 'file text icon';
  case 'mention':
    return 'at icon';
  default:
    return '?';
  }
};

/**
 * Returns a copy of the paramTypes with the name of the passed
 * in paramType toggled
 * @param paramTypes array
 * @param paramTypeToggleName which is the paramType you want to toggle
 * @returns copy of paramtypes with the paramTypeToggleName paramType toggled
 */
export const toggleParamType = (paramTypes, paramTypeToggleName) => (
  paramTypes.map((paramType) => {
    if (paramType.name !== paramTypeToggleName) {
      return paramType;
    }

    return {
      ...paramType,
      selected: !paramType.selected
    };
  })
);
