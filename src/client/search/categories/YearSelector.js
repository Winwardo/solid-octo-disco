import React, { Component } from 'react';
import { EARLIEST_YEAR_AVAILABLE_FROM_FOOTBALL_API } from './CategoryFilters';

const YearSelector = ({ seasonYears, currentYear, onClickToggleDbOnlySearch }) => {
  let seasonYearButtons = [];
  for (let y = currentYear; y >= EARLIEST_YEAR_AVAILABLE_FROM_FOOTBALL_API; y--) {
    let numberOfLeagues = (
        <div className="ui active small inline loader"></div>
    );

    // When season year's leagues have been retrieved remove loader and show the number of them
    if (seasonYears[y]) {
      if (!seasonYears[y].isFetching) {
        const numberOfLeaguesClassName = 'ui purple horizontal label year league count title';
        const transitionHidden = y === currentYear ? `${numberOfLeaguesClassName} transition hidden` : numberOfLeaguesClassName;
        numberOfLeagues = (
          <div data-id={y} className={transitionHidden}>
            {seasonYears[y].seasons.length}
          </div>);
      }
    }

    seasonYearButtons = [
      ...seasonYearButtons,
      (
      <a key={`yeartitle${y}`} className={y === currentYear ? 'active item' : 'item'} data-tab={y}>
        {numberOfLeagues}
        {y}/{parseInt(y, 10) + 1}
      </a>
      ),
    ];
  }

  return (
    <div className="ui top attached tabular menu">
      {seasonYearButtons}
      <div className="ui slider cache checkbox" style={{ float: 'right', marginLeft: 'auto' }}
        onClick={() => onClickToggleDbOnlySearch()}
      >
        <input type="checkbox" tabIndex="0" />
        <label>Search DB Cache Only</label>
      </div>
    </div>
  );
};

export default YearSelector;
