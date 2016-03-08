import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addSearchTerm } from './SearchActions';
import SearchTermsList from './SearchTermsList';

let nextSearchTermId = 0;
let CurrentQueryTerms = ({ dispatch }) => {
  let showSearchkeyword = false;
  let searchKeyword;
  return (
    <div className="row ui raised segment">
      <div style={{ cursor: 'text' }} onClick={() => {
        showSearchkeyword = !showSearchkeyword;
        if (showSearchkeyword) {
          $('#searchKeywordContainer').slideDown('fast', () => {
            searchKeyword.focus();
          });
        }
			}}>
        <SearchTermsList />

        <div id="searchKeywordContainer" className="ui fluid big transparent input"
             style={{
            display:'none',
            paddingLeft:20,
            paddingTop:10,
            marginTop:10,
            borderTop:1,
            borderTop: '2px dashed #D3D5D8',
			  }}>
          <input id="searchKeyword" type="text" placeholder="Search a keyword or hashtag"
                 ref={(node) => {
              searchKeyword = node;
						}}
                 onBlur={() => {
              $('#searchKeywordContainer').slideUp('fast', () => {
                showSearchkeyword = false;
              });
						}}

                 onKeyDown={(e) => {
              if (e.keyCode == 13) {
                dispatch(addSearchTerm(nextSearchTermId++, searchKeyword.value));
                searchKeyword.value = '';
              }
						}}/>
          <i className="link remove circle icon"></i>
        </div>
      </div>
    </div>
  );
};

CurrentQueryTerms = connect()(CurrentQueryTerms);

export default CurrentQueryTerms;