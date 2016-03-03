import { should } from 'chai';
import { flattenObjectToArray, flattenImmutableObject } from './utilities';
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

    it('can resolve functions on an immutable object and return a flat object', () => {
      const exampleImmutableObject = {
        'name': () => { return 'John'; },

        'age': () => {return 7; },

        'notAFunction': 'something',
      };

      exampleImmutableObject.name().should.equal('John');

      flattenImmutableObject(exampleImmutableObject).should.deep.equal({
        'name': 'John',
        'age': 7,
        'notAFunction': 'something',
      });

    });

  });

});
