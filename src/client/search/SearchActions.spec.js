import { should } from 'chai';
import * as actions from './SearchActions';

describe('search actions', () => {
	it('should create an action to add a hashtag', () => {
		const id = 0;
		const query = '#Footy';

		const expectedQuery = 'Footy'; 
		const expectedAction = {
			type: 'ADD_SEARCH_TERM',
			id,
			query: expectedQuery,
			paramTypes: ['hashtag'],
			source: 'twitter'
		};

		actions.addSearchTerm(id, query).should.deep.equal(expectedAction);
	});

	it('should create an action to add an author and mention', () => {
		const id = 0;
		const query = '@Manchester';

		const expectedQuery = 'Manchester'; 
		const expectedAction = {
			type: 'ADD_SEARCH_TERM',
			id,
			query: expectedQuery,
			paramTypes: ['author', 'mention'],
			source: 'twitter'
		};

		actions.addSearchTerm(id, query).should.deep.equal(expectedAction);
	});

	it('should create an action to add a default search term', () => {
		const id = 0;
		const query = 'Winning';

		const expectedQuery = 'Winning'; 
		const expectedAction = {
			type: 'ADD_SEARCH_TERM',
			id,
			query: expectedQuery,
			paramTypes: ['author', 'hashtag', 'keyword', 'mention'],
			source: 'twitter'
		};

		actions.addSearchTerm(id, query).should.deep.equal(expectedAction);
	});
});