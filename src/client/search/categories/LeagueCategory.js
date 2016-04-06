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

    const isFetchingLoader = <i className="purple icon"><div className="ui active inline loader"></div></i>;
    const isFetchingSmallLoader = <i className="purple icon"><div className="ui active small inline loader"></div></i>;

    const leagueCountTransitionClassName =
      this.props.tabYear === this.props.currentYear ?
      "ui purple horizontal label year league count content transition visible"
      :
      "ui purple horizontal label year league count content transition hidden"

    return (
      <div className="large ui dropdown labeled icon button leagues">
        {yearsLeagues.length === 0 ? isFetchingLoader : <i className="trophy purple icon"></i>}
        <span className="text">
          {
            yearsLeagues.length === 0 ?
              isFetchingSmallLoader
            :
              <div data-id={this.props.tabYear} className={leagueCountTransitionClassName}>
                {yearsLeagues.length}
              </div>
          }
          Leagues...
        </span>
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
                <div className="ui right floated">
                  <i className="add green circle icon float right"></i>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
LeagueCategory.propTypes = {
  leagues: React.PropTypes.object,
  tabYear: React.PropTypes.number,
  currentYear: React.PropTypes.number,
  onClickLeague: React.PropTypes.func
};

export default LeagueCategory;
