'use strict';

module.exports = {
  /**
   * Converts an object of style {'a': {'b': c}, 'd': {'e': f}} to [{'b': c}, {'e': f}]
   * @param {Object} givenObject
   * @returns {Array}
   */
  'flattenObjectToArray': (givenObject) => {
    let result = [];
    for (const key in givenObject) {
      if (givenObject.hasOwnProperty(key)) {
        result.push(givenObject[key]);
      }
    }

    return result;
  },
};
