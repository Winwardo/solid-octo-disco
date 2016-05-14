import React from 'react';
import { connect } from 'react-redux';
import { changeResultsView } from './resultsActions';
import SocialWebResults from './socialweb/SocialWebResults';

let Results = ({
  searchTerms, feed, mostFrequent, showJournalismInfo,
  onClickSocialWebResults, onClickJournalismInfo,
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

  return (
    <div className="row">
      <div className="ui fluid pointing two item top attached menu">
        <a className={`item ${!showJournalismInfo && 'active'}`} onClick={onClickSocialWebResults}>
          Social Web Results
        </a>
        <a className={`item ${showJournalismInfo && 'active'}`} onClick={onClickJournalismInfo}>
          Journalism Information
        </a>
      </div>
      <div className="ui bottom attached segment">
        <div className={`ui tab ${!showJournalismInfo && 'active'}`} data-tab="social-web">
          <SocialWebResults feed={feed} mostFrequent={mostFrequent}
            socialWebVisible={!showJournalismInfo}
          />
        </div>
        <div className={`ui tab ${showJournalismInfo && 'active'}`} data-tab="journalism-info">
          Here will go the journalist info
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  searchTerms: state.searchTerms,
  feed: state.feed,
  mostFrequent: state.mostFrequent,
  showJournalismInfo: state.showJournalismInfo,
});

const mapDispatchToProps = (dispatch) => ({
  onClickSocialWebResults: () => dispatch(changeResultsView(false)),
  onClickJournalismInfo: () => dispatch(changeResultsView(true)),
});

Results = connect(mapStateToProps, mapDispatchToProps)(Results);
export default Results;
