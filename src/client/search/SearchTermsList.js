import React, { Component } from 'react';
import { connect } from 'react-redux';
import TermItem from './TermItem';
import { deleteSearchTerm, toggleSearchTermParamTypeSelection } from './searchActions';

const TermsList = ({
  searchTerms, showSearchTerm,
  onSearchTermDeleteClick, onSearchTermParamTypeToggleClick
}) => (
  <div onClick={showSearchTerm}>
    <i className="icon search"></i>
    {searchTerms.map(term => (
      <TermItem
        key={term.id}
        {...term}
        onToggleParamTypeClick={(paramTypeToggle) => {
          console.log(term);
          return onSearchTermParamTypeToggleClick(term.id, paramTypeToggle);
        }}
        onDeleteClick={() => onSearchTermDeleteClick(term.id)}
      />
    ))}
  </div>
);

const mapStateToProps = (state) => ({ searchTerms: state.searchTerms });

const mapDispatchToProps = (dispatch) => ({
  onSearchTermDeleteClick: (id) => {
    dispatch(deleteSearchTerm(id));
  },
  onSearchTermParamTypeToggleClick: (id, paramTypeName) => {
    dispatch(toggleSearchTermParamTypeSelection(id, paramTypeName));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TermsList);
