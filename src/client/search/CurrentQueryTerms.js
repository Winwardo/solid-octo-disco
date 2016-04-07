import React, { Component } from 'react';
import SearchTermsList from './SearchTermsList';
import AddSearchTerm from './AddSearchTerm';

const CurrentQueryTerms = () => {
  const showAddSearchTerm = () => {
    // searchTermContainer and addSearchTerm are in ./AddSearchTerm
    // bad practise, should use react refs but using html id for simplicity
    if ($('#searchTermContainer').is(':hidden')) {
      $('#searchTermContainer').slideDown('fast', () => {
        $('#addSearchTerm').focus();
      });
    } else {
      $('#addSearchTerm').popup('hide');
      $('#addSearchTerm').popup('destroy');
      $('#searchTermContainer').slideUp('fast');
    }
  };

  return (
    <div className="row ui raised segment">
      <div style={{ cursor: 'text' }}>
        <SearchTermsList showSearchTerm={showAddSearchTerm} />
        <AddSearchTerm />
      </div>
    </div>
  );
};

export default CurrentQueryTerms;
