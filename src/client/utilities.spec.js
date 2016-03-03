require('chai').should();
Utilities = require('./utilities');

describe('#Utilities', () => {
  describe('Object flattener', ()=> {
    it('can flatten an object to an array', () => {
      Utilities.flattenObjectToArray(
        { 'a': { 'b': 1 }, 'd': { 'e': 2 } }
      ).should.deep.equal(
        [{ 'b': 1 }, { 'e': 2 }]
      );
    });
  });
});
