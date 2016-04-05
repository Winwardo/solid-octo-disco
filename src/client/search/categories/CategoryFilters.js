import React, { Component } from 'react';
import YearSelector from './YearSelector';
import { connect } from 'react-redux';
import LeagueCategory from './LeagueCategory';
import TeamCategory from './TeamCategory';
import PlayerCategory from './PlayerCategory';
import { fetchAllFootballLeagueTeams, fetchFootballTeamPlayers } from './categoryFilterActions';
import { addSearchTerm } from './../searchActions';
import moment from 'moment';

class CategoryFilters extends Component {
  componentDidMount() {
    $('.menu .item').tab({
      onVisible: (tabPath) => {
        let leagueLength = 0;
        if (this.props.football.leagueTeamsByYear[tabPath]) {
          leagueLength = this.props.football.leagueTeamsByYear[tabPath].leagues.length;
        }
        // only fetches the data for the football year if it hasn't already been fetched
        return this.props.onClickYearTab(tabPath, leagueLength);
      }
    });
  }

  render() {
    const currentYear = `${moment().year() - 1}`;
    let seasonYearTabsContent = [];
    for (let y = currentYear; y >= 2013; y--) {
      const tabContentClassName =
        y === currentYear ? 'ui bottom attached active tab segment' : 'ui bottom attached tab segment';

      seasonYearTabsContent.push(
        <div className={tabContentClassName} data-tab={y}>
          <div className="ui four column grid">
            <div className="center aligned column">
              <LeagueCategory leagues={this.props.football.seasonsByYear[y]}
                onClickLeague={this.props.onClickCategoryFilter}
              />
            </div>

            <div className="center aligned column">
              <div className="ui two column grid">
                <div className="column">
                  <TeamCategory teamsByLeague={this.props.football.leagueTeamsByYear[y]}
                    onClickAddTeam={this.props.onClickCategoryFilter}
                    onClickSelectTeam={this.props.onClickSelectTeam}
                  />
                </div>
                <div className="column">
                  {
                    !this.props.football.selectedTeam.isSelected &&
                      <span className="ui purple horizontal tag label">
                        Select a team to add players...
                      </span>
                  }
                </div>
              </div>
            </div>

            <div className="center aligned column">
              {
                this.props.football.selectedTeam.isSelected &&
                  <PlayerCategory teamName={this.props.football.selectedTeam.name}
                    teamCrestUrl={this.props.football.selectedTeam.crestUrl}
                    teamPlayers={this.props.football.selectedTeam.players}
                    onClickPlayer={this.props.onClickCategoryFilter}
                  />
              }
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <YearSelector seasonYears={this.props.football.seasonsByYear} currentYear={currentYear} />
        {seasonYearTabsContent}
      </div>
    );
  }
}
CategoryFilters.propTypes = {
  football: React.PropTypes.object,
  onClickCategoryFilter: React.PropTypes.func,
};

const mapStateToProps = (state) => ({ football: state.football });

const mapDispatchToProps = (dispatch) => ({
  onClickCategoryFilter: (newTerm) => dispatch(addSearchTerm(newTerm)),
  onClickSelectTeam: (id, name, shortName, crestUrl) =>
    dispatch(fetchFootballTeamPlayers(id, name, shortName, crestUrl)),
  onClickYearTab: (year, leagueLength) => {
    if (leagueLength === 0) {
      return dispatch(fetchAllFootballLeagueTeams(year));
    }

    return false;
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CategoryFilters);
