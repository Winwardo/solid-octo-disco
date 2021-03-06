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
      'ui purple horizontal label year league count content transition visible'
      :
      'ui purple horizontal label year league count content transition hidden';

    return (
      <div className="large fluid ui dropdown labeled icon button leagues category" style={{ paddingLeft: '13px!important', paddingRight: '38px!important' }}>
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
            const searchesQueriesSameAsLeague = this.props.currentSearchTerms
            .filter(
            (searchTerm) => searchTerm.query === leagueName || searchTerm.query === league.league
            );
            const leagueAlreadyAddedToSearch = searchesQueriesSameAsLeague.length > 0;
            return (
              <LeagueItem key={`league${league.id}`} name={leagueName}
                alreadyAddedToSearch={leagueAlreadyAddedToSearch}
                onClickLeague={() => {
                  if (leagueAlreadyAddedToSearch) {
                    searchesQueriesSameAsLeague.forEach(
                      search => this.props.onClickRemoveLeague(search.id)
                    );
                  } else {
                    this.props.onClickAddLeague(`*${leagueName}`, false);
                    this.props.onClickAddLeague(`#${league.league}`, false);
                  }
                }}
              />
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
  currentSearchTerms: React.PropTypes.array,
  currentYear: React.PropTypes.number,
  onClickAddLeague: React.PropTypes.func,
  onClickRemoveLeague: React.PropTypes.func,
};

const LeagueItem = ({ name, alreadyAddedToSearch, onClickLeague }) => (
  <div className="item league" onClick={() => onClickLeague()}>
    {name}
    <div className="ui right floated">
      {
        alreadyAddedToSearch ?
          <i className="remove red circle icon float right"></i>
        :
          <i className="add green circle icon float right"></i>
      }
    </div>
  </div>
);

export default LeagueCategory;
