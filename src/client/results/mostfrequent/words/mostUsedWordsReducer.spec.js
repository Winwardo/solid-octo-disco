import { should } from 'chai';
import deepFreeze from 'deep-freeze';
import mostUsedWordsReducer from './mostUsedWordsReducer';
import { updateMostUsedwordsSearch, toggleMostUsedWord } from './../../resultsActions';

describe('#MostUsedWordsReducer', () => {
  it('should add the given search term', () => {
    const stateBefore = {};
    const action = updateMostUsedwordsSearch('Football');

    const stateAfter = {
      filterTerm: 'Football',
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    mostUsedWordsReducer(stateBefore, action).should.deep.equal(stateAfter);
  });

  describe('Toggling of hidden words', () => {
    it('should add a hidden word', () => {
      const stateBefore = {
        wordsToHide: [],
      };
      const action = toggleMostUsedWord('LeMoN');

      const stateAfter = {
        wordsToHide: ['LeMoN'],
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      mostUsedWordsReducer(stateBefore, action).should.deep.equal(stateAfter);
    });

    it('should not conflate similar hidden words', () => {
      const stateBefore = {
        wordsToHide: ['lEmOn'],
      };
      const action = toggleMostUsedWord('LeMoN');

      const stateAfter = {
        wordsToHide: ['lEmOn', 'LeMoN'],
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      mostUsedWordsReducer(stateBefore, action).should.deep.equal(stateAfter);
    });

    it('should show/remove a hidden word', () => {
      const stateBefore = {
        wordsToHide: ['LEMON'],
      };
      const action = toggleMostUsedWord('LEMON');

      const stateAfter = {
        wordsToHide: [],
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      mostUsedWordsReducer(stateBefore, action).should.deep.equal(stateAfter);
    });
  });
});
