'use strict';

module.exports = {
  /**
   * Converts an object of style {'a': {'b': c}, 'd': {'e': f}} to [{'b': c}, {'e': f}]
   * @param givenObject
   * @returns {Array}
   */
  'flattenObjectToArray': function (givenObject) {
    let result = [];
    for (let key in givenObject) {
      if (givenObject.hasOwnProperty(key)) {
        result.push(givenObject[key]);
      }
    }

    return result;
  },
};
