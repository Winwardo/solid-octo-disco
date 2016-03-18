import React, { Component } from 'react';
import { connect } from 'react-redux';

const TermsList = ({ searchTerms, showSearchTerm }) => {
  return (
    <div onClick={showSearchTerm}>
      <i className="icon search"></i>
      {searchTerms.map(term => {
        return (
          <TermItem
            key={term.id}
            {...term}
          />
        );
      })}
    </div>
	);
};

const TermItem = ({ query, source, paramTypes }) => {
  return (
    <a className="ui label">
      {query}
      <i className="delete icon"></i>
    </a>
  );
};

const mapStateToProps = (state) => {
  console.log(state)
  return {
    searchTerms: state.search,
  };
};

export default connect(mapStateToProps)(TermsList);
