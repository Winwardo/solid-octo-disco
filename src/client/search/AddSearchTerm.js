import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addSearchTerm } from './searchActions';

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
          $('#addSearchTerm').popup('hide');
          $('#addSearchTerm').popup('destroy');
          $('#searchTermContainer').slideUp('fast');
        }}

        onKeyDown={(e) => {
          $('#addSearchTerm').popup('hide');
          $('#addSearchTerm').popup('destroy');
          if (e.keyCode === 13) {
            if (e.target.value.length < 2) {
              $('#addSearchTerm').popup({
                popup: '.negative.message.popup',
              });
              $('#addSearchTermErrorText').html('Can only be at least 2 characters');
              $('#addSearchTerm').popup('show');
            } else if (e.target.value.length >= 30) {
              $('#addSearchTerm').popup({
                popup: '.negative.message.popup',
              });
              $('#addSearchTermErrorText').html('Can only be less than 30 characters');
              $('#addSearchTerm').popup('show');
            } else {
              dispatch(addSearchTerm(e.target.value));
              e.target.value = '';
            }
          }
        }}
      />
      <div className="ui negative message popup transition hidden">
        <div className="header">
          <i className="red warning circle icon"></i>
          Search Validation Error
        </div>
        <p id="addSearchTermErrorText">
          this text will be changed by line 37 and 43
        </p>
      </div>
      <i className="link remove circle icon"></i>
    </div>
  );
};

AddSearchTerm = connect()(AddSearchTerm);

export default AddSearchTerm;
