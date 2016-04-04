import React, { Component } from 'react';

class LeagueCategory extends Component {
  componentDidMount() {
    $('.ui.dropdown.leagues').dropdown();
  }

  render() {
    return (
      <div className="ui dropdown labeled search icon button leagues">
        <i className="trophy icon"></i>
        <div className="menu">
          {this.props.leagues(league => {
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
