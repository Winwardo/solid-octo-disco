import { should } from 'chai';
import * as actions from './resultsActions';

describe('#resultsActions', () => {
  it('should create an action to change the results view (journalismInfo/socialWebResults)', () => {
    actions.changeResultsView(true).should.deep.equal({
      type: actions.CHANGE_RESULTS_VIEW,
      showJournalismInfo: true
    });
  });
});
