import { should } from 'chai';
import { flattenObjectToArray, flattenImmutableObject, makePostHeader, fetchPost } from './utilities';
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

    it('can recursively resolve functions on an immutable object and return a flat object', () => {
      const exampleImmutableObject = {
        'thing': () => {
          return {
            'inner': () => { return 'okay'; },
          };
        },
      };

      flattenImmutableObject(exampleImmutableObject, true).should.deep.equal({
        'thing': {
          'inner': 'okay',
        },
      });

    });

  });

  describe('HTTP request creator', () => {
    it('can create a simple POST request', () => {
      makePostHeader('hello').should.deep.equal({
        'method': 'POST',
        'headers': {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        'body': 'hello',
      });
    });

    it('can create a simple POST request given an object', () => {
      makePostHeader({ 'a': 'b' }).should.deep.equal({
        'method': 'POST',
        'headers': {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        'body': '{"a":"b"}',
      });
    });

  });

});
