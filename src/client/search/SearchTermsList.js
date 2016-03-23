import React, { Component } from 'react';
import { connect } from 'react-redux';
import TermItem from './TermItem';
import { deleteSearchTerm, toggleSearchTermParamTypeSelection } from './searchActions';

const TermsList = ({
  searchTerms, showSearchTerm,
  onSearchTermDeleteClick, onSearchTermParamTypeToggleClick,
}) => (
  <div onClick={showSearchTerm}>
    <i className="icon search"></i>
    {searchTerms.map(term => (
      <TermItem
        onToggleParamTypeClick={(paramTypeToggle) =>
          onSearchTermParamTypeToggleClick(term.id, paramTypeToggle)
        }
        key={term.id}
        {...term}
        onDeleteClick={() => onSearchTermDeleteClick(term.id)}
      />
    ))}
  </div>
);

const mapStateToProps = (state) => ({ searchTerms: state.searchTerms });

const mapDispatchToProps = (dispatch) => ({
  onSearchTermParamTypeToggleClick: (id, paramTypeName) => {
    dispatch(toggleSearchTermParamTypeSelection(id, paramTypeName));
  },

  onSearchTermDeleteClick: (id) => {
    dispatch(deleteSearchTerm(id));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TermsList);
