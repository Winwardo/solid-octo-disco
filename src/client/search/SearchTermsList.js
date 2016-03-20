import React, { Component } from 'react';
import { connect } from 'react-redux';
import TermItem from './TermItem';
import { deleteSearchTerm } from './searchActions';

const TermsList = ({ searchTerms, showSearchTerm, onSearchTermDeleteClick }) => (
  <div onClick={showSearchTerm}>
    <i className="icon search"></i>
    {searchTerms.map(term => (
      <TermItem
        key={term.id}
        {...term}
        onDeleteClick={() => onSearchTermDeleteClick(term.id)}
      />
    ))}
  </div>
);

const mapStateToProps = (state) => ({ searchTerms: state.searchTerms });

const mapDispatchToProps = (dispatch) => ({
  onSearchTermDeleteClick: (id) => {
    dispatch(deleteSearchTerm(id));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TermsList);
