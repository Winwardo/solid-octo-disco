import React, { Component } from 'react';

const YearSelector = ({ seasonYears, currentYear }) => {
  let seasonYearButtons = [];
  for (let y = currentYear; y >= 2013; y--) {
    let numberOfLeagues = (<div className="ui active small inline loader"></div>);
    // When season year's leagues have been retrieved remove loader and show the number of them
    if (seasonYears[y]) {
      if (!seasonYears[y].isFetching) {
        const numberOfLeaguesClassName = "ui purple horizontal label year league count title"
        const transitionHidden = y === currentYear ? `${numberOfLeaguesClassName} transition hidden` : numberOfLeaguesClassName
        numberOfLeagues = (
          <div data-id={y} className={transitionHidden}>
            {seasonYears[y].seasons.length}
          </div>);
      }
    }

    seasonYearButtons = [
      ...seasonYearButtons,
      (
      <a className={y === currentYear ? 'active item' : 'item'} data-tab={y}>
        {numberOfLeagues}
        {y}/{parseInt(y, 10) + 1}
      </a>
      ),
    ];
  }

  return (

    <div className="ui top attached tabular menu">
      {seasonYearButtons}
    </div>
  );
};

export default YearSelector;
