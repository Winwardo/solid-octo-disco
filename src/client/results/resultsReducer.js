import { CHANGE_RESULTS_VIEW } from './resultsActions';

const showJournalismInfo = (state = false, action) => {
  switch (action.type) {
  case CHANGE_RESULTS_VIEW:
    return action.showJournalismInfo;
  default:
    return state;
  }
};

export default showJournalismInfo;
