import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateMostUsedWordsSearch } from './mostUsedWordsActions';

let SlidingSearchBar = ({ dispatch, searchFor, currentValue }) => {
  return (
    <div className='ui fluid right icon input'>
      <input type='text' placeholder='Search...' value={currentValue} onChange={(e) => {
        dispatch(updateMostUsedWordsSearch(searchFor, e.target.value));
      }}/>
      <i className='search icon'></i>
    </div>
  );
};

SlidingSearchBar = connect()(SlidingSearchBar);
export default SlidingSearchBar;
