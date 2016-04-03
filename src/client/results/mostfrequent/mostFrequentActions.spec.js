import { should } from 'chai';
import {
  UPDATE_MOST_USED_WORDS_SEARCH_FILTER, updateMostUsedWordsSearch,
  UPDATE_MOST_ACTIVE_USERS_SEARCH_FILTER, updateActiveUsersSearch,
  TOGGLE_MOST_USED_WORDS, toggleMostUsedWords,
  TOGGLE_MOST_ACTIVE_USER, toggleMostActiveUser,
  TOGGLE_ALL_MOST_USED_WORDS, toggleAllMostUsedWordsSearch,
  TOGGLE_ALL_MOST_ACTIVE_USERS, toggleAllMostActiveUsersSearch,
} from './mostFrequentActions';

describe('#MostFrequentActions', () => {
  it('should create a correct search for most  used words', () => {
    updateMostUsedWordsSearch('filter').should.deep.equal({
      type: UPDATE_MOST_USED_WORDS_SEARCH_FILTER,
      filterTerm: 'filter',
    });
  });

  it('should create a correct search for most active user', () => {
    updateActiveUsersSearch('filter').should.deep.equal({
      type: UPDATE_MOST_ACTIVE_USERS_SEARCH_FILTER,
      filterTerm: 'filter',
    });
  });

  it('should create an action for toggling hiding most used word', () => {
    toggleMostUsedWords(['exampleWord']).should.deep.equal({
      type: TOGGLE_MOST_USED_WORDS,
      words: ['exampleWord'],
    });
  });

  it('should create an action for toggling hiding most active user', () => {
    toggleMostActiveUser('12345').should.deep.equal({
      type: TOGGLE_MOST_ACTIVE_USER,
      userId: '12345',
    });
  });

  it('should create an action for toggling all most used words', () => {
    toggleAllMostUsedWordsSearch('12345').should.deep.equal({
      type: TOGGLE_ALL_MOST_USED_WORDS,
    });
  });

  it('should create an action for toggling all most active users', () => {
    toggleAllMostActiveUsersSearch('12345').should.deep.equal({
      type: TOGGLE_ALL_MOST_ACTIVE_USERS,
    });
  });
});
