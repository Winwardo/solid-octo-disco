import { should } from 'chai';
import deepFreeze from 'deep-freeze';
import showJournalismInfo from './resultsReducer';
import * as actions from './resultsActions';

describe('#resultsReducer', () => {
  it('should change the results view', () => {
    const stateBefore = 0;
    const action = actions.changeResultsView(1);

    const stateAfter = 1;

    deepFreeze(action);

    showJournalismInfo(stateBefore, action).should.equal(stateAfter);
  });
});
