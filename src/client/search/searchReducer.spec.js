import { should } from 'chai';
import deepFreeze from 'deep-freeze';
import { searchTermsReducer, feedReducer } from './searchReducer';
import {
  ADD_SEARCH_TERM, DELETE_SEARCH_TERM,
  TOGGLE_SEARCH_TERM_PARAMTYPE_SELECTION,
  RECEIVE_FEED_RESULTS, SET_FEED_PAGE_NUMBER, SET_FEED_PAGE_LIMIT
} from './searchActions';
import { createTwitterParamTypes } from '../../shared/utilities';

describe('#SearchTermsReducer', () => {
  it('should add a hashtag search term', () => {
    const stateBefore = [];
    const action = {
      type: ADD_SEARCH_TERM,
      id: 0,
      query: 'Football',
      paramTypes: ['hashtag'],
      source: 'twitter',
    };

    const stateAfter = [{
      id: 0,
      query: 'Football',
      paramTypes: createTwitterParamTypes(['hashtag']),
      source: 'twitter',
    }, ];

    deepFreeze(stateBefore);
    deepFreeze(action);

    searchTermsReducer(stateBefore, action).should.deep.equal(stateAfter);
  });

  it('should add a new query to existing queries', () => {
    const stateBefore = [{
      id: 0,
      query: 'Football',
      paramTypes: createTwitterParamTypes(['mention']),
      source: 'twitter',
    }, ];
    const action = {
      type: ADD_SEARCH_TERM,
      id: 1,
      query: 'Manchester',
      paramTypes: ['hashtag', 'author'],
      source: 'twitter',
    };

    const stateAfter = [{
      id: 0,
      query: 'Football',
      paramTypes: createTwitterParamTypes(['mention']),
      source: 'twitter',
    }, {
      id: 1,
      query: 'Manchester',
      paramTypes: createTwitterParamTypes(['hashtag', 'author']),
      source: 'twitter',
    }, ];

    deepFreeze(stateBefore);
    deepFreeze(action);

    searchTermsReducer(stateBefore, action).should.deep.equal(stateAfter);
  });

  it('should return empty search terms when deleting search terms with single term', () => {
    const stateBefore = [{
      id: 0,
      query: 'Football',
      paramTypes: createTwitterParamTypes(['mention']),
      source: 'twitter',
    }, ];
    const action = {
      type: DELETE_SEARCH_TERM,
      id: 0,
    };

    const stateAfter = [];

    deepFreeze(stateBefore);
    deepFreeze(action);

    searchTermsReducer(stateBefore, action).should.deep.equal(stateAfter);
  });

  it('should delete term with id', () => {
    const stateBefore = [{
      id: 0,
      query: 'Football',
      paramTypes: createTwitterParamTypes(['mention']),
      source: 'twitter',
    }, {
      id: 1,
      query: 'Manchester',
      paramTypes: createTwitterParamTypes(['hashtag', 'author']),
      source: 'twitter',
    }, ];
    const action = {
      type: DELETE_SEARCH_TERM,
      id: 0,
    };

    const stateAfter = [{
      id: 1,
      query: 'Manchester',
      paramTypes: createTwitterParamTypes(['hashtag', 'author']),
      source: 'twitter',
    }, ];

    deepFreeze(stateBefore);
    deepFreeze(action);

    searchTermsReducer(stateBefore, action).should.deep.equal(stateAfter);
  });

  it('should edit term paramType with id', () => {
    const stateBefore = [{
      id: 0,
      query: 'Football',
      paramTypes: createTwitterParamTypes(['mention']),
      source: 'twitter',
    }, {
      id: 1,
      query: 'Manchester',
      paramTypes: createTwitterParamTypes(['hashtag', 'author']),
      source: 'twitter',
    }, ];
    const action = {
      type: TOGGLE_SEARCH_TERM_PARAMTYPE_SELECTION,
      id: 0,
      paramTypeName: 'author',
    };

    const stateAfter = [{
      id: 0,
      query: 'Football',
      paramTypes: createTwitterParamTypes(['author', 'mention']),
      source: 'twitter',
    }, {
      id: 1,
      query: 'Manchester',
      paramTypes: createTwitterParamTypes(['hashtag', 'author']),
      source: 'twitter',
    }, ];

    deepFreeze(stateBefore);
    deepFreeze(action);

    searchTermsReducer(stateBefore, action).should.deep.equal(stateAfter);
  });
});

describe('#FeedReducer', () => {
  it('can receive new feed results', () => {
    const stateBefore = {};

    const records = ['some record', 'another'];
    const action = {
      type: RECEIVE_FEED_RESULTS,
      data: {
        data: {
          records: records
        }
      }
    };

    const stateAfter = {posts: records};

    deepFreeze(stateBefore);
    deepFreeze(action);

    feedReducer(stateBefore, action).should.deep.equal(stateAfter);
  });

  it('can set the pagination page', () => {
    const stateBefore = {paginationInfo: {number: 1, limit: 10}};

    const action = {
      type: SET_FEED_PAGE_NUMBER,
      number: 5
    };

    const stateAfter = {paginationInfo: {number: 5, limit: 10}};

    deepFreeze(stateBefore);
    deepFreeze(action);

    feedReducer(stateBefore, action).should.deep.equal(stateAfter);
  });

  it('can set the pagination limit', () => {
    const stateBefore = {paginationInfo: {number: 1, limit: 10}};

    const action = {
      type: SET_FEED_PAGE_LIMIT,
      limit: 5
    };

    const stateAfter = {paginationInfo: {number: 1, limit: 5}};

    deepFreeze(stateBefore);
    deepFreeze(action);

    feedReducer(stateBefore, action).should.deep.equal(stateAfter);
  });
});
