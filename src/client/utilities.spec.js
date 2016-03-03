import { should } from 'chai';
import { flattenObjectToArray } from './utilities';
should();

describe('#Utilities', () => {
  describe('Object flattener', () => {
    it('can flatten an object to an array', () => {
      flattenObjectToArray(
        { 'a': { 'b': 1 }, 'd': { 'e': 2 } }
      ).should.deep.equal(
        [{ 'b': 1 }, { 'e': 2 }]
      );
    });
  });
});
