import React, { Component } from 'react';
import SlidingSearchBar from './SearchBar';

const MostFrequent = ({ title, onTypingInSearchBar, filterTerm, children }) => (
  <div>
    <h3>{title}</h3>
    <div>
      <div className="ui two column grid">
        <div className="column">
          <SlidingSearchBar onTypingInSearchBar={onTypingInSearchBar}
            currentValue={filterTerm}
          />
        </div>
        <div className="right aligned column">
          <ToggleAll />
        </div>
      </div>
      <br />
      {children}
    </div>
  </div>
);

const ToggleAll = () => (
  <button className="ui button">Hide all</button>
);

export default MostFrequent;
