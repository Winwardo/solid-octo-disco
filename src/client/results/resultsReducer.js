import { CHANGE_RESULTS_VIEW } from './resultsActions';

const showJournalismInfo = (state = 0, action) => {
  switch (action.type) {
  case CHANGE_RESULTS_VIEW:
    return action.resultsViewIndex;
  default:
    return state;
  }
};

export default showJournalismInfo;
