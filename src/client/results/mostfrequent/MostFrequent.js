import React, { Component } from 'react';
import SlidingSearchBar from './SearchBar';

const MostFrequent = ({
  title, icon, count, filterTerm, onTypingInSearchBar, onToggleAll, currentToggledAction, children
}) => (
  <div className="ui raised purple segment">
    <div className="ui one statistics">
      <div className="purple statistic">
        <div className="value">
          <i className={icon}></i> {count}
        </div>
        <div className="label">{title}</div>
      </div>
    </div>
    <br />
    <div>
      <div className="ui two column grid">
        <div className="column">
          <SlidingSearchBar onTypingInSearchBar={onTypingInSearchBar}
            currentValue={filterTerm}
          />
        </div>
        <div className="right aligned column">
          <button className="ui purple basic button" onClick={onToggleAll}>
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
