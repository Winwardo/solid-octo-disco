import React, { Component } from 'react';
import SlidingSearchBar from './SearchBar';

const MostFrequent = ({ title, filterTerm, onTypingInSearchBar, onToggleAll, currentToggledAction, children }) => (
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
          <button className="ui button" onClick={onToggleAll}>
            {currentToggledAction ? 'Hide all' : 'Show all'}
          </button>
        </div>
      </div>
      <br />
      {children}
    </div>
  </div>
);

export default MostFrequent;
