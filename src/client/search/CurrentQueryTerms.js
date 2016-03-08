import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addSearchTerm } from './SearchActions';
import SearchTermsList from './SearchTermsList';

let nextSearchTermId = 0;
const CurrentQueryTerms = () => {
  let showSearchkeyword = false;
  let containerRef;
  return (
    <div className="row ui raised segment">
      <div style={{ cursor: 'text' }} onClick={() => {
        showSearchkeyword = !showSearchkeyword;
        if (showSearchkeyword) {
          $(containerRef).slideDown('fast', () => {
            containerRef.focus();
          });
        } else {
          $(containerRef).slideUp('fast');
        }
			}}>
        <SearchTermsList />

        <AddSearchTerm addSearchTermRef={node => containerRef = node}/>
      </div>
    </div>
  );
};

let AddSearchTerm = ({ dispatch, addSearchTermRef }) => {
  const keywordSearchStyle = {
    display:'none',
    paddingLeft:20,
    paddingTop:10,
    marginTop:10,
    borderTop:1,
    borderTop: '2px dashed #D3D5D8',
  }
  return(
    <div className="ui fluid big transparent input"
      style={keywordSearchStyle}
      ref={addSearchTermRef}
      onClick={(e) => {
        e.stopPropagation();
      }}>
      <input type="text" placeholder="Search a keyword or hashtag"
        onBlur={() => {
          $(addSearchTermRef).slideUp('fast');
        }}
        onKeyDown={(e) => {
          console.log(e);
          if (e.keyCode == 13) {
            dispatch(addSearchTerm(nextSearchTermId++, searchKeyword.value));
            searchKeyword.value = '';
          }
        }}/>
      <i className="link remove circle icon"></i>
    </div>
  );
};

AddSearchTerm = connect()(AddSearchTerm);

export default CurrentQueryTerms;