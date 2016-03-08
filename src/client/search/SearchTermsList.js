import React, { Component } from 'react';
import { connect } from 'react-redux';

const TermsList = ({ searchTerms }) => {
  return (
    <div>
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
  return {
    searchTerms: state.searchTerms,
  };
};

export default connect(mapStateToProps)(TermsList);