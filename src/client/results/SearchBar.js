import React, { Component } from 'react';

const SlidingSearchBar = ({ onTypingInSearchBar, currentValue }) => (
  <div className="ui fluid right icon input">
    <input type="text" placeholder="Search..." value={currentValue} onChange={(e) => {
      onTypingInSearchBar(e.target.value);
    }} />
    <i className="search icon"></i>
  </div>
);

export default SlidingSearchBar;
