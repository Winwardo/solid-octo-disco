import { should } from 'chai';
import deepFreeze from 'deep-freeze';
import showJournalismInfo from './resultsReducer';
import * as actions from './resultsActions';

describe('#resultsReducer', () => {
  it('should change the results view', () => {
    const stateBefore = false;
    const action = actions.changeResultsView(true);

    const stateAfter = true;

    deepFreeze(action);

    showJournalismInfo(stateBefore, action).should.equal(stateAfter);
  });
});
