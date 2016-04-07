import React, { Component } from 'react';
import YearSelector from './YearSelector';
import { connect } from 'react-redux';
import { newPromiseChain } from './../../../shared/utilities';
import LeagueCategory from './LeagueCategory';
import TeamCategory from './TeamCategory';
import PlayerCategory from './PlayerCategory';
import {
  fetchAllFootballLeagueTeams,
  fetchFootballTeamPlayers, removeSelectedFootballTeamPlayers
} from './categoryFilterActions';
import { addSearchTerm, toggleSearchOnlyDb } from './../searchActions';
import moment from 'moment';

export const EARLIEST_YEAR_AVAILABLE_FROM_FOOTBALL_API = 2013;

class CategoryFilters extends Component {
  componentDidMount() {
    $('.menu .item').tab({
      onVisible: (tabPath) => {
        // animation for the league counts on the tabs
        const currentYear = moment().year() - 1;

        // for each year tab
        for (let y = currentYear; y >= EARLIEST_YEAR_AVAILABLE_FROM_FOOTBALL_API; y--) {
          // if the year is the visible tab
          if (parseInt(tabPath) === y) {
            // then hide the tab's title league count and show the league dropdown's count
            newPromiseChain()
              .then(() =>
                $(`.label.year.league.count.title[data-id="${y}"]`).transition('slide up'))
              .then(() =>
                $(`.label.year.league.count.content[data-id="${y}"]`).transition('slide down'))
              .then(() =>
                $(`.label.year.league.count.content[data-id="${y}"]`).transition('jiggle'));
          } else {
            // otherwise if the tab's title league count was hidden show it and hide the
            // hidden dropdown's count
            if ($(`.label.year.league.count.title[data-id="${y}"]`).hasClass('hidden')) {
              newPromiseChain()
                .then(() =>
                  $(`.label.year.league.count.title[data-id="${y}"]`).transition('slide up'))
                .then(() =>
                  $(`.label.year.league.count.content[data-id="${y}"]`).transition('slide down'));
            }
          }
        }

        let leagueLength = 0;
        if (this.props.football.leagueTeamsByYear[tabPath]) {
          leagueLength = this.props.football.leagueTeamsByYear[tabPath].leagues.length;
        }

        // only fetches the data for the football year if it hasn't already been fetched
        return this.props.onClickYearTab(tabPath, leagueLength);
      },
    });
  }

  render() {
    const currentYear = moment().year() - 1;
    let seasonYearTabsContent = [];
    for (let y = currentYear; y >= EARLIEST_YEAR_AVAILABLE_FROM_FOOTBALL_API; y--) {
      // adding active to the current year to show the initial year's tab
      const tabContentClassName =
        y === currentYear ? 'ui bottom attached active tab segment' : 'ui bottom attached tab segment';

      seasonYearTabsContent.push(
        <div key={`yearcontent${y}`} className={tabContentClassName} data-tab={y}>
          <div className="ui grid">
            <div className="center aligned four wide column">
              <LeagueCategory leagues={this.props.football.seasonsByYear[y]}
                currentYear={currentYear} tabYear={y}
                onClickLeague={this.props.onClickCategoryFilter}
              />
            </div>
            <div className="eight wide column">
              <div className="ui middle aligned grid">
                <div className="five wide column">
                  <TeamCategory teamsByLeague={this.props.football.leagueTeamsByYear[y]}
                    onClickAddTeam={this.props.onClickCategoryFilter}
                    onClickSelectTeam={this.props.onClickSelectTeam}
                  />
                </div>
                <div className="eleven wide column">
                  {
                    !this.props.football.selectedTeam.isSelected &&
                    this.props.football.leagueTeamsByYear[y] &&
                    !this.props.football.leagueTeamsByYear[y].isFetching &&
                      <span className="ui large purple tag label">
                        Select a team to add players...
                      </span>
                  }
                  {
                    this.props.football.selectedTeam.isSelected &&
                      <PlayerCategory teamName={this.props.football.selectedTeam.name}
                        isTeamPlayersFetching={this.props.football.selectedTeam.isFetching}
                        teamCrestUrl={this.props.football.selectedTeam.crestUrl}
                        teamPlayers={this.props.football.selectedTeam.players}
                        onClickPlayer={this.props.onClickCategoryFilter}
                      />
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <YearSelector seasonYears={this.props.football.seasonsByYear} currentYear={currentYear}
          onClickToggleDbOnlySearch={this.props.onClickToggleDbOnlySearch}
        />
        {seasonYearTabsContent}
      </div>
    );
  }
}
CategoryFilters.propTypes = {
  football: React.PropTypes.object,
  onClickCategoryFilter: React.PropTypes.func,
  onClickToggleDbOnlySearch: React.PropTypes.func,
};

const mapStateToProps = (state) => ({ football: state.football });

const mapDispatchToProps = (dispatch) => ({
  onClickCategoryFilter: (newTerm) => dispatch(addSearchTerm(newTerm)),
  onClickSelectTeam: (id, name, shortName, crestUrl) =>
    dispatch(fetchFootballTeamPlayers(id, name, shortName, crestUrl)),
  onClickYearTab: (year, leagueLength) => {
    dispatch(removeSelectedFootballTeamPlayers());
    if (leagueLength === 0) {
      return dispatch(fetchAllFootballLeagueTeams(year));
    }

    return false;
  },
  onClickToggleDbOnlySearch: () => {
    dispatch(toggleSearchOnlyDb());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CategoryFilters);
