import { should } from 'chai';
import deepFreeze from 'deep-freeze';
import {
  flattenObjectToArray, flattenImmutableObject,
  makePostHeader,
  createTwitterParamTypes, toggleParamType,
  range, tryPropertyOrElse, tryPropertyOrNA
} from './utilities';
should();

describe('#Utilities', () => {
  describe('Object flattener', () => {
    it('can flatten an object to an array', () => {
      flattenObjectToArray(
        { a: { b: 1 }, d: { e: 2 } }
      ).should.deep.equal(
        [{ b: 1 }, { e: 2 }]
      );
    });

    it('can resolve functions on an immutable object and return a flat object', () => {
      const exampleImmutableObject = {
        name: () => ('John'),

        age: () => (7),

        notAFunction: 'something',
      };

      exampleImmutableObject.name().should.equal('John');

      flattenImmutableObject(exampleImmutableObject).should.deep.equal({
        name: 'John',
        age: 7,
        notAFunction: 'something',
      });
    });

    it('can recursively resolve functions on an immutable object and return a flat object', () => {
      const exampleImmutableObject = {
        thing: () => ({
          inner: () => ('okay'),
        }),
      };

      flattenImmutableObject(exampleImmutableObject, true).should.deep.equal({
        thing: {
          inner: 'okay',
        },
      });
    });
  });

  describe('HTTP request creator', () => {
    it('can create a simple POST request', () => {
      makePostHeader('hello').should.deep.equal({
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: 'hello',
      });
    });

    it('can create a simple POST request given an object', () => {
      makePostHeader({ a: 'b' }).should.deep.equal({
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: '{"a":"b"}',
      });
    });
  });

  describe('paramType object functions', () => {
    it('can create a twitter specific paramTypes object for search terms', () => {
      createTwitterParamTypes(['hashtag', 'keyword']).should.deep.equal(
        [
          {
            name: 'author',
            selected: false,
            icon: 'user icon',
          },
          {
            name: 'hashtag',
            selected: true,
            icon: '#',
          },
          {
            name: 'keyword',
            selected: true,
            icon: 'file text icon',
          },
          {
            name: 'mention',
            selected: false,
            icon: 'at icon',
          },
        ]
      );
    });

    it('can toggle a paramType with the paramTypeName to toggle', () => {
      const paramTypesBefore = createTwitterParamTypes(['hashtag', 'keyword']);
      const paramTypesExpected = createTwitterParamTypes(['hashtag']);

      deepFreeze(paramTypesBefore);

      toggleParamType(paramTypesBefore, 'keyword').should.deep.equal(paramTypesExpected);
    });
  });

  describe('creating a range', () => {
    it('can create a simple range from 0 to n', () => {
      range(0, 5).should.deep.equal([0, 1, 2, 3, 4]);
    });

    it('can create a simple range from m to n', () => {
      range(2, 5).should.deep.equal([2, 3, 4]);
    });

    it('returns empty if m > n', () => {
      range(10, 5).should.deep.equal([]);
    });

    it('can step correctly', () => {
      range(1, 10, 2).should.deep.equal([1, 3, 5, 7, 9]);
    });

    it('does not allow negative steps', () => {
      range(1, 10, -1).should.deep.equal([]);
    });
  });

  describe('retrieving properties from SPARQL objects', () => {
    it('will return the value for a property that exists', () => {
      const myValue = "something";
      const else_ = "another thing";
      const actual = tryPropertyOrElse(
        {
          myProperty: {
            value: myValue
          }
        },
        "myProperty",
        else_
      );

      actual.should.equal(myValue);
    });

    it('will return else for a property that doesn\'t exist', () => {
      const myValue = "something";
      const else_ = "another thing";
      const actual = tryPropertyOrElse(
        {
          myProperty: {
            value: myValue
          }
        },
        "someOtherProperty",
        else_
      );

      actual.should.equal(else_);
    });

    it('will return else for a property that exists but lacks a .value', () => {
      const myValue = "something";
      const else_ = "another thing";
      const actual = tryPropertyOrElse(
        {
          myProperty: {
            notValue: myValue
          }
        },
        "myProperty",
        else_
      );

      actual.should.equal(else_);
    });

    it('will return N/A for a property that doesn\'t exist', () => {
      const myValue = "something";
      const actual = tryPropertyOrNA(
        {
          myProperty: {
            value: myValue
          }
        },
        "someOtherProperty",
      );

      actual.should.equal("N/A");
    });
  })
});

