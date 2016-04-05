import React, { Component } from 'react';
import YearSelector from './YearSelector';
import { connect } from 'react-redux';
import LeagueCategory from './LeagueCategory';
import TeamCategory from './TeamCategory';
import { fetchAllFootballLeagueTeams } from './categoryFilterActions';
import moment from 'moment';
import { addSearchTerm } from './../searchActions';

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
    for (let year in this.props.football.seasonsByYear) {
      const tabContentClassName =
        year === currentYear ? 'ui bottom attached active tab segment' : 'ui bottom attached tab segment';

      seasonYearTabsContent.push(
        <div className={tabContentClassName} data-tab={year}>
          <div className="ui five column grid">
            <div className="column">
              <LeagueCategory leagues={this.props.football.seasonsByYear[year]}
                onClickLeague={this.props.onClickCategoryFilter}
              />
            </div>

            <div className="column">
              <TeamCategory teamsByLeague={this.props.football.leagueTeamsByYear[year]}
                onClickTeam={this.props.onClickCategoryFilter}
              />
            </div>

            <div className="column">
              {/*<PlayerCategory />*/}
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
