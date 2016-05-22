import React from 'react';
import { connect } from 'react-redux';
import { changeResultsView } from './resultsActions';
import SocialWebResults from './socialweb/SocialWebResults';
import JournalismInformation from './journalism/JournalismInformation';
import { selectEntityTab, selectTeamEntityMatch } from './journalism/journalismActions';

const SOCIALWEB_RESULTS_TAB_INDEX = 0;
const JOURNALISM_INFORMATION_TAB_INDEX = 1;

let Results = ({
  searchTerms, feed, mostFrequent, resultsViewIndex, onClickChangeResultsView,
  journalismInfo, onClickSelectEntityTab, onClickSelectTeamMatch
}) => {
  if (searchTerms.length === 0) {
    return (
      <div className="row">
        <div className="col-xs-12">
          <div className="ui violet inverted center aligned segment">
            <h3 className="ui inverted header">
              Start using Socto by typing into the search bar or by using the filters.
            </h3>
          </div>
        </div>
      </div>
    );
  }

  const showSocialWebResults = resultsViewIndex === SOCIALWEB_RESULTS_TAB_INDEX;
  const showJournalismInfo = resultsViewIndex === JOURNALISM_INFORMATION_TAB_INDEX;
  return (
    <div className="row">
      <div className="ui fluid pointing two item top attached menu">
        <a className={`item ${showSocialWebResults && 'active'}`}
          onClick={() => onClickChangeResultsView(SOCIALWEB_RESULTS_TAB_INDEX)}
        >
          Social Web Results
        </a>
        <a className={`item ${showJournalismInfo && 'active'}`}
          onClick={() => onClickChangeResultsView(JOURNALISM_INFORMATION_TAB_INDEX)}
        >
          Journalism Information
        </a>
      </div>
      <div className="ui bottom attached segment">
        <div className={`ui tab ${showSocialWebResults && 'active'}`} data-tab="social-web">
          <SocialWebResults feed={feed} mostFrequent={mostFrequent}
            socialWebVisible={showSocialWebResults}
          />
        </div>
        <div className={`ui tab ${showJournalismInfo && 'active'}`} data-tab="journalism-info">
          <JournalismInformation
            journalismInfo={journalismInfo}
            onClickSelectEntityTab={onClickSelectEntityTab}
            onClickSelectTeamMatch={onClickSelectTeamMatch}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  searchTerms: state.searchTerms,
  feed: state.feed,
  mostFrequent: state.mostFrequent,
  resultsViewIndex: state.resultsTabShown,
  journalismInfo: state.journalismInfo,
});

const mapDispatchToProps = (dispatch) => ({
  onClickChangeResultsView: (newResultsViewIndex) => dispatch(changeResultsView(newResultsViewIndex)),
  onClickSelectEntityTab: (newEntityTabIndex) => dispatch(selectEntityTab(newEntityTabIndex)),
  onClickSelectTeamMatch: (entityId, newTeamMatchId) => dispatch(selectTeamEntityMatch(entityId, newTeamMatchId)),
});

Results = connect(mapStateToProps, mapDispatchToProps)(Results);
export default Results;
