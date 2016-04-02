import React, { Component } from 'react';
import { connect } from 'react-redux';
import TermItem from './TermItem';
import {
  deleteSearchTerm, invalidateFeedResults, toggleSearchTermParamTypeSelection
} from './searchActions';

class TermsList extends Component {
  componentWillReceiveProps() {
    this.props.onSearchTermsChange();
  }

  render() {
    return (
      <div onClick={this.props.showSearchTerm}>
        <i className="icon search"></i>
        {this.props.searchTerms.map(term => (
          <TermItem
            onToggleParamTypeClick={(paramTypeToggle) =>
              this.props.onSearchTermParamTypeToggleClick(term.id, paramTypeToggle)
            }
            key={term.id}
            {...term}
            onDeleteClick={() => this.props.onSearchTermDeleteClick(term.id)}
          />
        ))}
      </div>
    );
  }
}
TermsList.propTypes = {
  searchTerms: React.PropTypes.array,
  showSearchTerm: React.PropTypes.func,
  onSearchTermParamTypeToggleClick: React.PropTypes.func,
  onSearchTermDeleteClick: React.PropTypes.func,
  onSearchTermsChange: React.PropTypes.func,
};

const mapStateToProps = (state) => ({ searchTerms: state.searchTerms });

const mapDispatchToProps = (dispatch) => ({
  onSearchTermParamTypeToggleClick: (id, paramTypeName) => {
    dispatch(toggleSearchTermParamTypeSelection(id, paramTypeName));
  },
  onSearchTermDeleteClick: (id) => {
    dispatch(deleteSearchTerm(id));
  },
  onSearchTermsChange: () => {
    dispatch(invalidateFeedResults());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TermsList);
