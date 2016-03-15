import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addSearchTerm } from './SearchActions';

let nextSearchTermId = 0;

let AddSearchTerm = ({ dispatch }) => {
  const keywordSearchStyle = {
    display: 'none',
    paddingLeft: 20,
    paddingTop: 10,
    marginTop: 10,
    borderTop: '2px dashed #D3D5D8',
  };
  return (
    <div className="ui fluid big transparent input"
      style={keywordSearchStyle}
      id="searchTermContainer"
    >
      <input id="addSearchTerm" type="text"
        placeholder="Search a keyword or hashtag"
        onBlur={() => {
          $('#searchTermContainer').slideUp('fast');
        }}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            dispatch(addSearchTerm(nextSearchTermId++, e.target.value));
            e.target.value = '';
          }
        }}
      />
      <i className="link remove circle icon"></i>
    </div>
  );
};

AddSearchTerm = connect()(AddSearchTerm);

export default AddSearchTerm;
