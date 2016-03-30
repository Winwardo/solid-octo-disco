import { should } from 'chai';
import deepFreeze from 'deep-freeze';
import mostActiveUsersReducer from './mostActiveUsersReducer';
import { updateActiveUsersSearch, toggleMostActiveUser } from './../../resultsActions';

describe('#MostActiveUsersReducer', () => {
  it('should add the given search term', () => {
    const stateBefore = {};
    const action = updateActiveUsersSearch('Football');

    const stateAfter = {
      filterTerm: 'Football',
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    mostActiveUsersReducer(stateBefore, action).should.deep.equal(stateAfter);
  });

  describe('Toggling of hidden users', () => {
    it('should add a hidden word', () => {
      const stateBefore = {
        usersToHide: [],
      };
      const action = toggleMostActiveUser('12345');

      const stateAfter = {
        usersToHide: ['12345'],
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      mostActiveUsersReducer(stateBefore, action).should.deep.equal(stateAfter);
    });

    it('should show/remove a hidden users', () => {
      const stateBefore = {
        usersToHide: ['12345'],
      };
      const action = toggleMostActiveUser('12345');

      const stateAfter = {
        usersToHide: [],
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      mostActiveUsersReducer(stateBefore, action).should.deep.equal(stateAfter);
    });
  });
});
