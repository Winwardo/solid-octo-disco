import { should } from 'chai';
import deepFreeze from 'deep-freeze';
import {
  searchTermsReducer, feedReducer, journalismInfoReducerInitialState, journalismInfoReducer
} from './searchReducer';
import * as actions from './searchActions';
import { createTwitterParamTypes } from '../../shared/utilities';
import { groupedCountWords, mostFrequentWords, mostFrequentUsers } from './../tweetAnalysis';

describe('#SearchTermsReducer', () => {
  it('should add a hashtag search term', () => {
    const stateBefore = [];
    const action = actions.addSearchTerm('#Football', false);

    const stateAfter = [{
      id: action.id,
      query: 'Football',
      paramTypes: createTwitterParamTypes(['hashtag']),
      source: 'twitter',
      entity: false,
      details: false,
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
      entity: false,
      details: false,
    }, ];
    const action = actions.addSearchTerm('@Manchester', false);

    const stateAfter = [
      ...stateBefore,
      {
        id: 11,
        query: 'Manchester',
        paramTypes: createTwitterParamTypes(['mention', 'author']),
        source: 'twitter',
        entity: false,
        details: false,
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
      entity: false,
      details: false,
    }, ];
    const action = actions.deleteSearchTerm(0);

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
      entity: false,
      details: false,
    }, {
      id: 1,
      query: 'Manchester',
      paramTypes: createTwitterParamTypes(['hashtag', 'author']),
      source: 'twitter',
      entity: false,
      details: false,
    }, ];
    const action = actions.deleteSearchTerm(0);

    const stateAfter = [{
      id: 1,
      query: 'Manchester',
      paramTypes: createTwitterParamTypes(['hashtag', 'author']),
      source: 'twitter',
      entity: false,
      details: false,
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
      entity: false,
      details: false,
    }, {
      id: 1,
      query: 'Manchester',
      paramTypes: createTwitterParamTypes(['hashtag', 'author']),
      source: 'twitter',
      entity: false,
      details: false,
    }, ];
    const action = actions.toggleSearchTermParamTypeSelection(0, 'author');

    const stateAfter = [{
      id: 0,
      query: 'Football',
      paramTypes: createTwitterParamTypes(['author', 'mention']),
      source: 'twitter',
      entity: false,
      details: false,
    }, {
      id: 1,
      query: 'Manchester',
      paramTypes: createTwitterParamTypes(['hashtag', 'author']),
      source: 'twitter',
      entity: false,
      details: false,
    }, ];

    deepFreeze(stateBefore);
    deepFreeze(action);

    searchTermsReducer(stateBefore, action).should.deep.equal(stateAfter);
  });

  it('should add a team entity search term', () => {
    const stateBefore = [];
    const action = actions.addSearchTerm('#Manchester United FC', actions.TEAM_ENTITY, 1);

    const stateAfter = [{
      id: action.id,
      query: 'Manchester United FC',
      paramTypes: createTwitterParamTypes(['hashtag']),
      source: 'twitter',
      entity: actions.TEAM_ENTITY,
      details: 1,
    }, ];

    deepFreeze(stateBefore);
    deepFreeze(action);

    searchTermsReducer(stateBefore, action).should.deep.equal(stateAfter);
  });

  it('should add a player entity search term', () => {
    const stateBefore = [];
    const action = actions.addSearchTerm('#Wayne Rooney', actions.PLAYER_ENTITY);

    const stateAfter = [{
      id: action.id,
      query: 'Wayne Rooney',
      paramTypes: createTwitterParamTypes(['hashtag']),
      source: 'twitter',
      entity: actions.PLAYER_ENTITY,
      details: false,
    }, ];

    deepFreeze(stateBefore);
    deepFreeze(action);

    searchTermsReducer(stateBefore, action).should.deep.equal(stateAfter);
  });
});

describe('#FeedReducer', () => {
  it('can receive new feed results, and will group and sort them', () => {
    const stateBefore = {};

    const records = [
      { data:{ content:'some record', date: '2016-04-06' }, author:{ id: '1' } },
      { data:{ content:'another', date: '2014-04-06' }, author:{ id: '2' } },
    ];

    const action = {
      type: actions.RECEIVE_FEED_RESULTS,
      data: {
        data: {
          records: records,
        },
      },
      fetchedRequestFromTwitter: false,
    };

    const stateAfter = {
      posts: records,
      groupedMostFrequentWords: groupedCountWords(mostFrequentWords(records.map((post) => post.data.content))),
      mostFrequentUsers: mostFrequentUsers(records),
      fetchingRequestFromDB: false,
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    feedReducer(stateBefore, action).should.deep.equal(stateAfter);
  });

  it('can set the pagination page', () => {
    const stateBefore = { paginationInfo: { number: 1, limit: 10 } };

    const action = {
      type: actions.SET_FEED_PAGE_NUMBER,
      number: 5,
    };

    const stateAfter = { paginationInfo: { number: 5, limit: 10 } };

    deepFreeze(stateBefore);
    deepFreeze(action);

    feedReducer(stateBefore, action).should.deep.equal(stateAfter);
  });

  it('can set the pagination limit', () => {
    const stateBefore = { paginationInfo: { number: 1, limit: 10 } };

    const action = {
      type: actions.SET_FEED_PAGE_LIMIT,
      limit: 5,
    };

    const stateAfter = { paginationInfo: { number: 1, limit: 5 } };

    deepFreeze(stateBefore);
    deepFreeze(action);

    feedReducer(stateBefore, action).should.deep.equal(stateAfter);
  });
});

describe('#JournalismInfoReducer', () => {
  it('invalidates the journalism info', () => {
    const stateBefore = journalismInfoReducerInitialState;

    const action = {
      type: actions.INVALIDATE_JOURNALISM_INFORMATION
    };

    const stateAfter = {
      ...stateBefore,
      fetchingEntityInfo: true,
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    journalismInfoReducer(stateBefore, action).should.deep.equal(stateAfter);
  });

  it('shows that it is requesting an enitity', () => {
    const stateBefore = journalismInfoReducerInitialState;

    const action = {
      type: actions.REQUEST_ENTITY,
      id: 0,
      query: 'Manchester United FC',
      entityType: actions.TEAM_ENTITY,
    };

    const stateAfter = {
      ...stateBefore,
      entities: {
        [action.id]: {
          query: action.query,
          entityType: action.entityType,
          fetching: true,
        }
      },
      requestedEntitiesCount: journalismInfoReducerInitialState.requestedEntitiesCount + 1,
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    journalismInfoReducer(stateBefore, action).should.deep.equal(stateAfter);
  });

  it('correctly receives an enitity and stops invalidation since all entities fetched', () => {
    const entityId = 0;

    const stateBefore = {
      ...journalismInfoReducerInitialState,
      entities: {
        [entityId]: {
          query: 'Manchester United FC',
          entityType: actions.TEAM_ENTITY,
          fetching: true,
        }
      },
      requestedEntitiesCount: journalismInfoReducerInitialState.requestedEntitiesCount + 1,
    };

    const action = {
      type: actions.RECEIVE_ENTITY,
      id: entityId,
      entityInfo: { exampleInfo: [] }
    };

    const stateAfter = {
      ...stateBefore,
      entities: {
        [entityId]: {
          ...stateBefore.entities[entityId],
          fetching: false,
          entity: action.entityInfo
        }
      },
      requestedEntitiesCount: 0,
      entityCurrentlySelected: entityId,
      fetchingEntityInfo: false,
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    journalismInfoReducer(stateBefore, action).should.deep.equal(stateAfter);
  });
});
