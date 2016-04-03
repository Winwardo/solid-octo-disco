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
 * Checks if the element is in the array, if it is, then return a new array
 * with it removed else add it to the new array
 * @param any primitive type that can be .indexOf(ed) from an array
 * @return new [Array]
 */
export const toggleArrayElement = (array, element) => {
  const termIndex = array.indexOf(element);
  if (termIndex > -1) {
    return [
      ...array.slice(0, termIndex),
      ...array.slice(termIndex + 1),
    ];
  }

  return [...array, element];
};

/**
 * Starts a new Promise chain, resolving immediately.
 * @param callback Must return a Promise.
 * @returns {Promise}
 */
export const newPromiseChain = () => (
  new Promise((resolve) => {
    resolve();
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
 * @returns [{Object}] representing search terms with meta data
 */
export const createTwitterParamTypes = (selectedParamTypes) =>
  ['author', 'hashtag', 'keyword', 'mention']
    .map((paramType) => makeParamType(selectedParamTypes, paramType));

const makeParamType = (selectedParamTypes, type) => ({
  name: type,
  selected: selectedParamTypes.indexOf(type) > -1,
  icon: getParamTypeIcon(type),
});

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
      selected: !paramType.selected,
    };
  })
);

/**
 * Returns a decorated callback function, which will be called some time later.
 * However, if the returned function is called again before the callback
 * is activated, the timer will be reset.
 * This might be useful say when delaying running a search until 200ms after
 * the user has stopped typing.
 * @param callback
 * @param milliseconds
 * @returns {Function}
 */
export const throttleFunction = (callback, milliseconds) => {
  let timeout;

  return (...args) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => callback.apply(undefined, args), milliseconds);
  };
};

/**
 * Creates an array filled with numbers between the range [min, max)
 * @param min The start number, inclusive.
 * @param max The end number, exclusive
 * @param step Step between each number, must be positive.
 * @returns {Array}
 */
export const range = (min, max, step=1) => {
  if (step <= 0) {
    return [];
  };

  const result = [];
  for (let i = min; i < max; i += step) {
    result.push(i);
  }
  return result;
}
