import React, { Component } from 'react';

const YearSelector = ({ seasonYears, currentYear }) => {
  let seasonYearButtons = [];
  for (let year in seasonYears) {
    const numberOfLeaguesInSeason = seasonYears[year].seasons.length;
    seasonYearButtons = [
      (
        <a className={year == currentYear ? 'active item' : 'item'} data-tab={year}>
          <div className="ui purple horizontal label">{numberOfLeaguesInSeason}</div>
          {year}
        </a>
      ),
      ...seasonYearButtons,
    ];
  }

  return (

    <div className="ui top attached tabular menu">
      {seasonYearButtons}
    </div>
  );
};

export default YearSelector;
