import { should } from 'chai';
import deepFreeze from 'deep-freeze';
import MostUsedTermsReducer from './mostUsedWordsReducer';
import { HIDE_MOST_USED_WORD, SHOW_MOST_USED_WORD } from './mostUsedWordsActions';

describe('#MostUsedWordsReducer', () => {
  it('should add the given search term', () => {
    const stateBefore = {};
    const action = {
      'type': 'UPDATE_SEARCH_MOST_USED_WORDS_FILTER',
      'filterTerm': 'Football',
    };

    const stateAfter = {
      filterTerm: 'Football',
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    MostUsedTermsReducer(stateBefore, action).should.deep.equal(stateAfter);
  });

  describe('Hiding words', () => {
    it('should add a hidden word', () => {
      const stateBefore = {
        wordsToHide: {}
      };
      const action = {
        type: HIDE_MOST_USED_WORD,
        word: 'LeMoN',
      };

      const stateAfter = {
        wordsToHide: {
          LeMoN: true
        }
      };

      //deepFreeze(stateBefore);
      //deepFreeze(action);

      MostUsedTermsReducer(stateBefore, action).should.deep.equal(stateAfter);
    });

    it('should not conflate similar hidden words', () => {
      const stateBefore = {
        wordsToHide: {
          lEmOn: true,
        }
      };
      const action = {
        type: HIDE_MOST_USED_WORD,
        word: 'LeMoN',
      };

      const stateAfter = {
        wordsToHide: {
          lEmOn: true,
          LeMoN: true,
        }
      };

      //deepFreeze(stateBefore);
      //deepFreeze(action);

      MostUsedTermsReducer(stateBefore, action).should.deep.equal(stateAfter);
    });

    it('should stay the same if trying to hide an already hidden word', () => {
      const stateBefore = {
        wordsToHide: {
          LEMON: true
        }
      };
      const action = {
        type: HIDE_MOST_USED_WORD,
        word: 'LEMON',
      };

      const stateAfter = {
        wordsToHide: {
          LEMON: true
        }
      };

      //deepFreeze(stateBefore);
      //deepFreeze(action);

      MostUsedTermsReducer(stateBefore, action).should.deep.equal(stateAfter);
    });

    it('should show/remove a hidden word', () => {
      const stateBefore = {
        wordsToHide: {
          LEMON: true
        }
      };
      const action = {
        type: SHOW_MOST_USED_WORD,
        word: 'LEMON',
      };

      const stateAfter = {
        wordsToHide: {
        }
      };

      //deepFreeze(stateBefore);
      //deepFreeze(action);

      MostUsedTermsReducer(stateBefore, action).should.deep.equal(stateAfter);
    });

    it('should stay the same if trying to show a non-hidden word', () => {
      const stateBefore = {
        wordsToHide: {
        }
      };
      const action = {
        type: SHOW_MOST_USED_WORD,
        word: 'LEMON',
      };

      const stateAfter = {
        wordsToHide: {
        }
      };

      //deepFreeze(stateBefore);
      //deepFreeze(action);

      MostUsedTermsReducer(stateBefore, action).should.deep.equal(stateAfter);
    });
  });
});
