import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addSearchTerm } from '../search/SearchActions';

let SlidingSearchBar = ({ dispatch }) => {
  return (
    <div className='ui fluid right icon input'>
      <input type='text' placeholder='Search...' onChange={(e) => {
        //console.log(`store.dispatch(${e.target.value})`);
        dispatch({'type': 'UPDATE_MOST_USED_WORDS_FILTER', 'value': e.target.value});
      }}/>
      <i className='search icon'></i>
    </div>
  )
};

SlidingSearchBar = connect()(SlidingSearchBar);
export default SlidingSearchBar;
