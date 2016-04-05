import React, { Component } from 'react';

class LeagueCategory extends Component {
  componentDidMount() {
    $('.ui.dropdown.leagues').dropdown({
      action: 'nothing',
    });
  }

  render() {
    let yearsLeagues = [];
    if (this.props.leagues) {
      if (!this.props.leagues.isFetching) {
        yearsLeagues = this.props.leagues.seasons;
      }
    }

    return (
      <div className="ui dropdown labeled icon button leagues">
        <i className="trophy purple icon"></i>
        <span className="text">Leagues...</span>
        <div className="menu">
          <div className="ui icon search input">
            <i className="search icon"></i>
            <input type="text" placeholder="Search tags..." />
          </div>
          {yearsLeagues.map(league => {
            // gets rid of the 20XX/YY year at the end of the caption
            const leagueName = league.caption.slice(0, league.caption.length - 7);
            return (
              <div className="item league" onClick={() => this.props.onClickLeague(leagueName)}>
                {leagueName}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
LeagueCategory.propTypes = {
  leagues: React.PropTypes.array,
  onClickLeague: React.PropTypes.func
};

export default LeagueCategory;
