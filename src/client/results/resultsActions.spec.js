import { should } from 'chai';
import {
  UPDATE_SEARCH_MOST_USED_WORDS_FILTER, updateMostUsedwordsSearch,
  UPDATE_SEARCH_MOST_ACTIVE_USERS_FILTER, updateActiveUsersSearch,
  TOGGLE_MOST_USED_WORD, toggleMostUsedWord,
  TOGGLE_MOST_ACTIVE_USER, toggleMostActiveUser
} from './resultsActions';

describe('#ResultsActions', () => {
  it('should create a correct search for most  used words', () => {
    updateMostUsedwordsSearch('filter').should.deep.equal({
      type: UPDATE_SEARCH_MOST_USED_WORDS_FILTER,
      filterTerm: 'filter',
    });
  });

  it('should create a correct search for most active user', () => {
    updateActiveUsersSearch('filter').should.deep.equal({
      type: UPDATE_SEARCH_MOST_ACTIVE_USERS_FILTER,
      filterTerm: 'filter',
    });
  });

  it('should create an action for toggling hiding most used word', () => {
    toggleMostUsedWord('exampleWord').should.deep.equal({
      type: TOGGLE_MOST_USED_WORD,
      word: 'exampleWord',
    });
  });

  it('should create an action for toggling hiding most active user', () => {
    toggleMostActiveUser('12345').should.deep.equal({
      type: TOGGLE_MOST_ACTIVE_USER,
      userId: '12345',
    });
  });
});
