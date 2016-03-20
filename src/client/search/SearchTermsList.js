import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteSearchTerm } from './searchActions';
// import { getParamTypeIcon } from '../../shared/utilities';

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

const TermItem = ({ onDeleteClick, query, source, paramTypes }) => {
  let termClass = 'ui large image ';
  switch (source) {
  case 'twitter':
    termClass += 'blue label';
    break;
  default:
    termClass += 'label';
  }

  // TODO edit
  // const paramTypeIcons = paramTypes.map((paramTypeText) => {
  //   const paramIcon = getParamTypeIcon(paramTypeText);
  //   if (paramIcon.length > 1) {
  //     return <i className={paramIcon}></i>;
  //   }
  //   return <i className="icon">{paramIcon}</i>;
  // });

  return (
    <a className={termClass}>
      <i className="twitter icon"></i>
      {query}
      <div className="detail" onClick={(e) => {
        e.stopPropagation();
        onDeleteClick();
      }}
      >
        <i className="delete icon"></i>
      </div>
    </a>
  );
};

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
