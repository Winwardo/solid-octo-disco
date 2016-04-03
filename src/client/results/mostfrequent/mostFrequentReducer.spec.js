import { should } from 'chai';
import deepFreeze from 'deep-freeze';
import mostFrequentReducer from './mostFrequentReducer';
import {
  updateMostUsedWordsSearch, toggleMostUsedWords, toggleAllMostUsedWordsSearch,
  updateActiveUsersSearch, toggleMostActiveUser, toggleAllMostActiveUsersSearch
} from './mostFrequentActions';

const initialState = {
  words: {
    filterTerm: '',
    toToggle: [],
    isToggledActionHide: true,
  },
  users: {
    filterTerm: '',
    toToggle: [],
    isToggledActionHide: true,
  },
};

describe('#MostFrequentReducer', () => {
  describe('Most used words', () => {
    it('should add the given search term to words search filter', () => {
      const stateBefore = initialState;
      const action = updateMostUsedWordsSearch('Football');

      const stateAfter = {
        words: {
          filterTerm: 'Football',
          toToggle: [],
          isToggledActionHide: true,
        },
        users: {
          filterTerm: '',
          toToggle: [],
          isToggledActionHide: true,
        },
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      mostFrequentReducer(stateBefore, action).should.deep.equal(stateAfter);
    });

    it('should change toggle isToggledActionHide and empty the toToggle words', () => {
      const stateBefore = {
        words: {
          filterTerm: '',
          toToggle: ['lEmOn'],
          isToggledActionHide: true,
        },
        users: {
          filterTerm: '',
          toToggle: ['12345'],
          isToggledActionHide: true,
        },
      };
      const action = toggleAllMostUsedWordsSearch();

      const stateAfter = {
        words: {
          filterTerm: '',
          toToggle: [],
          isToggledActionHide: false,
        },
        users: {
          filterTerm: '',
          toToggle: ['12345'],
          isToggledActionHide: true,
        },
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      mostFrequentReducer(stateBefore, action).should.deep.equal(stateAfter);
    });

    describe('Toggling of hidden words', () => {
      it('should add a hidden word', () => {
        const stateBefore = initialState;
        const action = toggleMostUsedWords(['LeMoN']);

        const stateAfter = {
          words: {
            filterTerm: '',
            toToggle: ['LeMoN'],
            isToggledActionHide: true,
          },
          users: {
            filterTerm: '',
            toToggle: [],
            isToggledActionHide: true,
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
            toToggle: ['lEmOn'],
            isToggledActionHide: true,
          },
          users: {
            filterTerm: '',
            toToggle: [],
            isToggledActionHide: true,
          },
        };
        const action = toggleMostUsedWords(['LeMoN']);

        const stateAfter = {
          words: {
            filterTerm: '',
            toToggle: ['lEmOn', 'LeMoN'],
            isToggledActionHide: true,
          },
          users: {
            filterTerm: '',
            toToggle: [],
            isToggledActionHide: true,
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
            toToggle: ['LEMON'],
            isToggledActionHide: true,
          },
          users: {
            filterTerm: '',
            toToggle: [],
            isToggledActionHide: true,
          },
        };
        const action = toggleMostUsedWords(['LEMON']);

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
          toToggle: [],
          isToggledActionHide: true,
        },
        users: {
          filterTerm: 'Football',
          toToggle: [],
          isToggledActionHide: true,
        },
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      mostFrequentReducer(stateBefore, action).should.deep.equal(stateAfter);
    });

    it('should change isToggledActionHide and empty the toToggle users', () => {
      const stateBefore = {
        words: {
          filterTerm: '',
          toToggle: [],
          isToggledActionHide: true,
        },
        users: {
          filterTerm: '',
          toToggle: ['12345'],
          isToggledActionHide: true,
        },
      };
      const action = toggleAllMostActiveUsersSearch();

      const stateAfter = {
        words: {
          filterTerm: '',
          toToggle: [],
          isToggledActionHide: true,
        },
        users: {
          filterTerm: '',
          toToggle: [],
          isToggledActionHide: false,
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
            toToggle: [],
            isToggledActionHide: true,
          },
          users: {
            filterTerm: '',
            toToggle: ['12345'],
            isToggledActionHide: true,
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
            toToggle: [],
            isToggledActionHide: true,
          },
          users: {
            filterTerm: '',
            toToggle: ['12345'],
            isToggledActionHide: true,
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
