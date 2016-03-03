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
};;
