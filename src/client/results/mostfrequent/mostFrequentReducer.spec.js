import { should } from 'chai';
import deepFreeze from 'deep-freeze';
import mostFrequentReducer from './mostFrequentReducer';
import {
  updateMostUsedwordsSearch, toggleMostUsedWord,
  updateActiveUsersSearch, toggleMostActiveUser
} from './mostFrequentActions';

const initialState = {
  words: {
    filterTerm: '',
    toHide: [],
  },
  users: {
    filterTerm: '',
    toHide: [],
  },
};

describe('#MostFrequentReducer', () => {
  describe('Most used words', () => {
    it('should add the given search term to words search filter', () => {
      const stateBefore = initialState;
      const action = updateMostUsedwordsSearch('Football');

      const stateAfter = {
        words: {
          filterTerm: 'Football',
          toHide: [],
        },
        users: {
          filterTerm: '',
          toHide: [],
        },
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      mostFrequentReducer(stateBefore, action).should.deep.equal(stateAfter);
    });

    describe('Toggling of hidden words', () => {
      it('should add a hidden word', () => {
        const stateBefore = initialState;
        const action = toggleMostUsedWord('LeMoN');

        const stateAfter = {
          words: {
            filterTerm: '',
            toHide: ['LeMoN'],
          },
          users: {
            filterTerm: '',
            toHide: [],
          },
        };

        deepFreeze(stateBefore);
        deepFreeze(action);

        mostFrequentReducer(stateBefore, action).should.deep.equal(stateAfter);
      });

      it('should not conflate similar hidden words', () => {
        const stateBefore = {
          words: {
            filterTerm: '',
            toHide: ['lEmOn'],
          },
          users: {
            filterTerm: '',
            toHide: [],
          },
        };
        const action = toggleMostUsedWord('LeMoN');

        const stateAfter = {
          words: {
            filterTerm: '',
            toHide: ['lEmOn', 'LeMoN'],
          },
          users: {
            filterTerm: '',
            toHide: [],
          },
        };

        deepFreeze(stateBefore);
        deepFreeze(action);

        mostFrequentReducer(stateBefore, action).should.deep.equal(stateAfter);
      });

      it('should show/remove a hidden word', () => {
        const stateBefore = {
          words: {
            filterTerm: '',
            toHide: ['LEMON'],
          },
          users: {
            filterTerm: '',
            toHide: [],
          },
        };
        const action = toggleMostUsedWord('LEMON');

        const stateAfter = initialState;

        deepFreeze(stateBefore);
        deepFreeze(action);

        mostFrequentReducer(stateBefore, action).should.deep.equal(stateAfter);
      });
    });
  });

  describe('Most active users', () => {
    it('should add the given search term for most active users', () => {
      const stateBefore = initialState;
      const action = updateActiveUsersSearch('Football');

      const stateAfter = {
        words: {
          filterTerm: '',
          toHide: [],
        },
        users: {
          filterTerm: 'Football',
          toHide: [],
        },
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      mostFrequentReducer(stateBefore, action).should.deep.equal(stateAfter);
    });

    describe('Toggling of hidden users', () => {
      it('should add a hidden word', () => {
        const stateBefore = initialState;
        const action = toggleMostActiveUser('12345');

        const stateAfter = {
          words: {
            filterTerm: '',
            toHide: [],
          },
          users: {
            filterTerm: '',
            toHide: ['12345'],
          },
        };

        deepFreeze(stateBefore);
        deepFreeze(action);

        mostFrequentReducer(stateBefore, action).should.deep.equal(stateAfter);
      });

      it('should show/remove a hidden users', () => {
        const stateBefore = {
          words: {
            filterTerm: '',
            toHide: [],
          },
          users: {
            filterTerm: '',
            toHide: ['12345'],
          },
        };
        const action = toggleMostActiveUser('12345');

        const stateAfter = initialState;

        deepFreeze(stateBefore);
        deepFreeze(action);

        mostFrequentReducer(stateBefore, action).should.deep.equal(stateAfter);
      });
    });
  });
});
