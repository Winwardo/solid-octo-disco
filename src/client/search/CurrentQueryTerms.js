import React, { Component } from 'react';
import SearchTermsList from './SearchTermsList';
import AddSearchTerm from './AddSearchTerm';

let nextSearchTermId = 0;

const CurrentQueryTerms = () => {
  const showAddSearchTerm = () => {
    //searchTermContainer and addSearchTerm are in ./AddSearchTerm
    if ($('#searchTermContainer').is(':hidden')) {
      $('#searchTermContainer').slideDown('fast', () => {
        $('#addSearchTerm').focus();
      });
    } else {
      $('#searchTermContainer').slideUp('fast');
    }
  };

  return (
    <div className="row ui raised segment">
      <div style={{ cursor: 'text' }}>
        <SearchTermsList showSearchTerm={showAddSearchTerm}/>

        <AddSearchTerm addSerchTermRef={node => searchTermRef = node}/>
      </div>
    </div>
  );
};

export default CurrentQueryTerms;
