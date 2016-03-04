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
