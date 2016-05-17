import moment from 'moment';
import {
  ADD_SEARCH_TERM, TOGGLE_SEARCH_TERM_PARAMTYPE_SELECTION, DELETE_SEARCH_TERM,
  RECEIVE_FEED_RESULTS, SET_FEED_PAGE_NUMBER, SET_FEED_PAGE_LIMIT, TOGGLE_SEARCH_ONLY_DB,
  INVALIDATE_FEED_RESULTS, INVALIDATE_JOURNALISM_INFORMATION, REQUEST_ENTITY, RECEIVE_ENTITY
} from './searchActions';
import { SELECT_ENTITY_TAB } from '../results/journalism/journalismActions';
import { createTwitterParamTypes, toggleParamType } from '../../shared/utilities';
import { groupedCountWords, mostFrequentWords, mostFrequentUsers } from './../tweetAnalysis';

export const searchTermsReducer = (state = [], action) => {
  switch (action.type) {
  case ADD_SEARCH_TERM:
    return [
      ...state,
      searchTermReducer(undefined, action),
    ];
  case TOGGLE_SEARCH_TERM_PARAMTYPE_SELECTION:
    return state.map(searchTerm => searchTermReducer(searchTerm, action));
  case DELETE_SEARCH_TERM: {
    if (state.length === 1) return [];

    const termIndex = state.map(term => (term.id)).indexOf(action.id);
    return [
      ...state.slice(0, termIndex),
      ...state.slice(termIndex + 1),
    ];
  }
  default:
    return state;
  }
};

const searchTermReducer = (state, action) => {
  switch (action.type) {
  case ADD_SEARCH_TERM:
    return {
      id: action.id,
      query: action.query,
      paramTypes: createTwitterParamTypes(action.paramTypes),
      source: action.source,
      entity: action.entity,
      details: action.details ? action.details : false,
    };
  case TOGGLE_SEARCH_TERM_PARAMTYPE_SELECTION: {
    if (state.id !== action.id) {
      return state;
    }

    return {
      ...state,
      paramTypes: toggleParamType(state.paramTypes, action.paramTypeName),
    };
  }

  default:
    return state;
  }
};

export const searchOnlyDB = (state = false, action) => {
  switch (action.type) {
  case TOGGLE_SEARCH_ONLY_DB:
    return !state;
  default:
    return state;
  }
};

const feedReducerInitialState = {
  posts: [],
  paginationInfo: {
    number: 1,
    limit: 10,
  },
  groupedMostFrequentWords: [],
  mostFrequentUsers: [],
  fetchingRequestFromDB: false,
  lastRequestId: 0,
};

export const feedReducer = (state = feedReducerInitialState, action) => {
  switch (action.type) {
  case INVALIDATE_FEED_RESULTS:
    return {
      ...state,
      lastRequestId: action.requestId,
      fetchingRequestFromDB: true,
    };
  case RECEIVE_FEED_RESULTS:
    if (state.lastRequestId > action.requestId) {
      // Response is from an old request, ignore it
      return state;
    } else {
      // Response is from the most recent request, actually show the posts
      return {
        ...state,
        posts: sortPostsForFeed(action.data.data.records),
        groupedMostFrequentWords: groupedCountWords(mostFrequentWords(action.data.data.records.map((post) => post.data.content))),
        mostFrequentUsers: mostFrequentUsers(action.data.data.records),
        fetchingRequestFromDB: action.fetchedRequestFromTwitter,
      };
    }
  case SET_FEED_PAGE_NUMBER:
    return { ...state, paginationInfo: { ...state.paginationInfo, number: action.number } };
  case SET_FEED_PAGE_LIMIT:
    return { ...state, paginationInfo: { ...state.paginationInfo, limit: action.limit } };
  default:
    return state;
  }
};

const sortPostsForFeed = (feed) => (
  [...feed].sort(
    (post1, post2) => (
      moment(post2.data.date).diff(moment(post1.data.date))
    )
  )
);

export const journalismInfoReducerInitialState = {
  entities: {},
  entityCurrentlySelected: false,
  fetchingEntityInfo: false,
  requestedEntitiesCount: 0,
};

export const journalismInfoReducer = (state = journalismInfoReducerInitialState, action) => {
  switch (action.type) {
  case INVALIDATE_JOURNALISM_INFORMATION:
    return {
      ...state,
      fetchingEntityInfo: true,
    };
  case REQUEST_ENTITY:
    return {
      ...state,
      entities: {
        ...state.entities,
        [action.id]: entityReducer(state.entities[action.id], action),
      },
      requestedEntitiesCount: state.requestedEntitiesCount + 1,
    };
  case RECEIVE_ENTITY: {
    const recievedEntity = {
      ...state,
      entities: {
        ...state.entities,
        [action.id]: entityReducer(state.entities[action.id], action),
      },
      entityCurrentlySelected: !state.entityCurrentlySelected && state.entityCurrentlySelected !== 0 ? action.id : state.entityCurrentlySelected,
    };

    if (state.requestedEntitiesCount - 1 === 0) {
      return {
        ...recievedEntity,
        requestedEntitiesCount: 0,
        fetchingEntityInfo: false,
      };
    }

    return {
      ...recievedEntity,
      requestedEntitiesCount: state.requestedEntitiesCount - 1,
    };
  }
  case SELECT_ENTITY_TAB:
    return {
      ...state,
      entityCurrentlySelected: action.newEntityTabIndex,
    };
  default:
    return state;
  }
};

const entityReducer = (state, action) => {
  switch (action.type) {
  case REQUEST_ENTITY:
    return {
      query: action.query,
      entityType: action.entityType,
      fetching: true,
      details: action.details,
    };
  case RECEIVE_ENTITY:
    return {
      ...state,
      entity: action.entityInfo,
      fetching: false,
    };
  default:
    return state;
  }
};
