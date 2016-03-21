import { should } from 'chai';
import * as actions from './searchActions';

describe('#SearchActions', () => {
  it('should create an action to add a hashtag', () => {
    const id = 0;
    const query = '#Footy';

    const expectedQuery = 'Footy';
    const expectedAction = {
      type: 'ADD_SEARCH_TERM',
      id,
      query: expectedQuery,
      paramTypes: ['hashtag'],
      source: 'twitter',
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
      source: 'twitter',
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
      source: 'twitter',
    };

    actions.addSearchTerm(id, query).should.deep.equal(expectedAction);
  });

  it('should create an action to delete search term with id', () => {
    const id = 1;

    const expectedAction = {
      type: actions.DELETE_SEARCH_TERM,
      id,
    };

    actions.deleteSearchTerm(id).should.deep.equal(expectedAction);
  });

  it('should create an action to toggle a search term with id paramtype selection', () => {
    const id = 1;
    const paramTypeName = 'author';

    const expectedAction = {
      type: actions.TOGGLE_SEARCH_TERM_PARAMTYPE_SELECTION,
      id,
      paramTypeName
    };

    actions.toggleSearchTermParamTypeSelection(id, paramTypeName)
      .should.deep.equal(expectedAction);
  });
});
