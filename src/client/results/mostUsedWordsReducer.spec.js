import { should } from 'chai';
import deepFreeze from 'deep-freeze';
import MostUsedTermsReducer from './mostUsedWordsReducer';

describe('#MostUsedWordsReducer', () => {
  it('should add the given search term', () => {
    const stateBefore = {};
    const action = {
      type: 'UPDATE_MOST_USED_WORDS_FILTER',
      value: 'Football',
    };

    const stateAfter = {
      'filterTerm': 'Football'
    }

    deepFreeze(stateBefore);
    deepFreeze(action);

    MostUsedTermsReducer(stateBefore, action).should.deep.equal(stateAfter);
  });
});