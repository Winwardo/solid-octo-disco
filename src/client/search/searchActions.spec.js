import { should } from 'chai';
import * as actions from './searchActions';

describe('#SearchActions', () => {
  let searchTermId = 0;

  it('should create an action to add a hashtag', () => {
    const query = '#Footy';

    const expectedQuery = 'Footy';
    const expectedAction = {
      type: 'ADD_SEARCH_TERM',
      id: searchTermId++,
      query: expectedQuery,
      paramTypes: ['hashtag'],
      source: 'twitter',
      entity: false,
    };

    actions.addSearchTerm(query, false).should.deep.equal(expectedAction);
  });

  it('should create an action to add just a keyword', () => {
    const query = '*Footy';

    const expectedQuery = 'Footy';
    const expectedAction = {
      type: 'ADD_SEARCH_TERM',
      id: searchTermId++,
      query: expectedQuery,
      paramTypes: ['keyword'],
      source: 'twitter',
      entity: false,
    };

    actions.addSearchTerm(query, false).should.deep.equal(expectedAction);
  });

  it('should create an action to add an author and mention', () => {
    const query = '@Manchester';

    const expectedQuery = 'Manchester';
    const expectedAction = {
      type: 'ADD_SEARCH_TERM',
      id: searchTermId++,
      query: expectedQuery,
      paramTypes: ['author', 'mention'],
      source: 'twitter',
      entity: false,
    };

    actions.addSearchTerm(query, false).should.deep.equal(expectedAction);
  });

  it('should create an action to add everything apart from a hashtag', () => {
    const query = '^#Footy';

    const expectedQuery = 'Footy';
    const expectedAction = {
      type: 'ADD_SEARCH_TERM',
      id: searchTermId++,
      query: expectedQuery,
      paramTypes: ['author', 'keyword', 'mention'],
      source: 'twitter',
      entity: false,
    };

    actions.addSearchTerm(query, false).should.deep.equal(expectedAction);
  });

  it('should create an action to add everything apart from a keyword', () => {
    const query = '^*Footy';

    const expectedQuery = 'Footy';
    const expectedAction = {
      type: 'ADD_SEARCH_TERM',
      id: searchTermId++,
      query: expectedQuery,
      paramTypes: ['author', 'hashtag', 'mention'],
      source: 'twitter',
      entity: false,
    };

    actions.addSearchTerm(query, false).should.deep.equal(expectedAction);
  });

  it('should create an action to add everything apart from author and mention', () => {
    const query = '^@Footy';

    const expectedQuery = 'Footy';
    const expectedAction = {
      type: 'ADD_SEARCH_TERM',
      id: searchTermId++,
      query: expectedQuery,
      paramTypes: ['hashtag', 'keyword'],
      source: 'twitter',
      entity: false,
    };

    actions.addSearchTerm(query, false).should.deep.equal(expectedAction);
  });

  it('should create an action to add a default search term if ^ without a symbol afterwards', () => {
    const query = '^Footy';

    const expectedQuery = 'Footy';
    const expectedAction = {
      type: 'ADD_SEARCH_TERM',
      id: searchTermId++,
      query: expectedQuery,
      paramTypes: ['author', 'hashtag', 'keyword', 'mention'],
      source: 'twitter',
      entity: false,
    };

    actions.addSearchTerm(query, false).should.deep.equal(expectedAction);
  });

  it('should create an action to add a default search term', () => {
    const query = 'Winning';

    const expectedQuery = 'Winning';
    const expectedAction = {
      type: 'ADD_SEARCH_TERM',
      id: searchTermId++,
      query: expectedQuery,
      paramTypes: ['author', 'hashtag', 'keyword', 'mention'],
      source: 'twitter',
      entity: false,
    };

    actions.addSearchTerm(query, false).should.deep.equal(expectedAction);
  });

  it('should create an action to add a player entity', () => {
    const query = 'Wayne Rooney';

    const expectedQuery = 'Wayne Rooney';
    const expectedAction = {
      type: 'ADD_SEARCH_TERM',
      id: searchTermId++,
      query: expectedQuery,
      paramTypes: ['author', 'hashtag', 'keyword', 'mention'],
      source: 'twitter',
      entity: actions.PLAYER_ENTITY,
    };

    actions.addSearchTerm(query, actions.PLAYER_ENTITY).should.deep.equal(expectedAction);
  });

  it('should create an action to add a team entity', () => {
    const query = 'Manchester United FC';

    const expectedQuery = 'Manchester United FC';
    const expectedAction = {
      type: 'ADD_SEARCH_TERM',
      id: searchTermId++,
      query: expectedQuery,
      paramTypes: ['author', 'hashtag', 'keyword', 'mention'],
      source: 'twitter',
      entity: actions.TEAM_ENTITY,
      details: 1,
    };

    actions.addSearchTerm(query, actions.TEAM_ENTITY, 1).should.deep.equal(expectedAction);
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
      paramTypeName,
    };

    actions.toggleSearchTermParamTypeSelection(id, paramTypeName)
      .should.deep.equal(expectedAction);
  });
});
