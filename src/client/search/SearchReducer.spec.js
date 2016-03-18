import { should } from 'chai';
import deepFreeze from 'deep-freeze';
import { ADD_SEARCH_TERM, RECEIVE_FEED_RESULTS } from './SearchActions';
import { searchReducer, feedReducer } from './SearchReducer';

describe('#searchReducer', () => {
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
      paramTypes: ['hashtag'],
      source: 'twitter',
    },];

    deepFreeze(stateBefore);
    deepFreeze(action);

    searchReducer(stateBefore, action).should.deep.equal(stateAfter);
  });

  it('should add a new query to existing queries', () => {
    const stateBefore = [{
      id: 0,
      query: 'Football',
      paramTypes: ['mention'],
      source: 'twitter',
    },];
    const action = {
      type: ADD_SEARCH_TERM,
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

    searchReducer(stateBefore, action).should.deep.equal(stateAfter);
  });
});

describe('#feedReducer', () => {
  it('should fill an empty posts with the new data when receiving feed results', () => {
    const stateBefore = {
      'posts': [],
    };
    const newPosts = [{ 'data': 'something' }];
    const action = { 'type': RECEIVE_FEED_RESULTS, 'data': newPosts };

    deepFreeze(stateBefore);
    deepFreeze(action);

    const stateAfter = {
      'posts': newPosts,
    };

    feedReducer(stateBefore, action).should.deep.equal(stateAfter);
  });

  it('should overwrite existing posts with the new data when receiving feed results', () => {
    const stateBefore = {
      'posts': [{ 'data': 'before data' }, { 'data': 'more stuff' }],
    };
    const newPosts = [{ 'data': 'something' }];
    const action = { 'type': RECEIVE_FEED_RESULTS, 'data': newPosts };

    deepFreeze(stateBefore);
    deepFreeze(action);

    const stateAfter = {
      'posts': newPosts,
    };

    feedReducer(stateBefore, action).should.deep.equal(stateAfter);
  });
});
