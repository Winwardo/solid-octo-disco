import { should } from 'chai';
import deepFreeze from 'deep-freeze';
import SearchTermsReducer from './SearchTermsReducer'

describe(SearchTermsReducer, () => {
	it('should add a hashtag search term', () => {
		const stateBefore = [];
		const action = {
			type: 'ADD_SEARCH_TERM',
			id: 0,
			query: '#Football',
			paramType: 'hashtag',
			source: 'twitter'
		};

		const stateAfter = [{
			id: 0,
			query: '#Football',
			paramType: ['hashtag'],
			source: 'twitter'
		}];
		
		deepFreeze(stateBefore);
		deepFreeze(action);

		SearchTermsReducer(stateBefore, action).should.deep.equal(stateAfter);
	});
});