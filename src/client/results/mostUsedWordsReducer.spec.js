import { should } from 'chai';
import deepFreeze from 'deep-freeze';
import MostUsedTermsReducer from './mostUsedWordsReducer';

describe('#MostUsedWordsReducer', () => {
  it('should add the given search term', () => {
    const stateBefore = {};
    const action = {
      'type': 'UPDATE_SEARCH_MOST_USED_WORDS_FILTER',
      'filterTerm': 'Football',
    };

    const stateAfter = {
      'filterTerm': 'Football',
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    MostUsedTermsReducer(stateBefore, action).should.deep.equal(stateAfter);
  });
});
