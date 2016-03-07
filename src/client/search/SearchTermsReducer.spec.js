import { should } from 'chai';
import deepFreeze from 'deep-freeze';
import SearchTermsReducer from './SearchTermsReducer';

describe(SearchTermsReducer, () => {
  it('should add a hashtag search term', () => {
    const stateBefore = [];
    const action = {
      type: 'ADD_SEARCH_TERM',
      id: 0,
      query: 'Football',
      paramTypes: ['hashtag'],
      source: 'twitter',
    };

    const stateAfter = [{
      id: 0,
      query: 'Football',
      paramTypes: ['hashtag'],
      source: 'twitter',
    },];

    deepFreeze(stateBefore);
    deepFreeze(action);

    SearchTermsReducer(stateBefore, action).should.deep.equal(stateAfter);
  });

  it('should add a new query to existing queries', () => {
    const stateBefore = [{
      id: 0,
      query: 'Football',
      paramTypes: ['mention'],
      source: 'twitter',
    },];
    const action = {
      type: 'ADD_SEARCH_TERM',
      id: 1,
      query: 'Manchester',
      paramTypes: ['hashtag', 'author'],
      source: 'twitter',
    };

    const stateAfter = [
			{
  id: 0,
  query: 'Football',
  paramTypes: ['mention'],
  source: 'twitter',
			}, {
  id: 1,
  query: 'Manchester',
  paramTypes: ['hashtag', 'author'],
  source: 'twitter',
			},
		];

    deepFreeze(stateBefore);
    deepFreeze(action);

    SearchTermsReducer(stateBefore, action).should.deep.equal(stateAfter);
  });
});
