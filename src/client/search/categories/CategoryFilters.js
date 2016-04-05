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
      onVisible: (tabPath) => this.props.onClickYearTab(tabPath)
    });
  }

  componentDidUpdate() {
    $('.menu .item').tab({
      onVisible: (tabPath) => this.props.onClickYearTab(tabPath)
    });
  }

  render() {
    const currentYear = `${moment().year() - 1}`;
    let seasonYearTabsContent = [];
    for (let year in this.props.football.seasonsByYear) {
      const tabContentClassName =
        year === currentYear ? 'ui bottom attached active tab segment' : 'ui bottom attached tab segment';

      let yearsLeagues = [];
      if (this.props.football.seasonsByYear[year]) {
        if (!this.props.football.seasonsByYear[year].isFetching) {
          yearsLeagues = this.props.football.seasonsByYear[year].seasons;
        }
      }

      let leagueTeams = [];
      if (this.props.football.leagueTeamsByYear[year]) {
        if (!this.props.football.leagueTeamsByYear[year].isFetching) {
          leagueTeams = this.props.football.leagueTeamsByYear[year].leagues;
        }
      }

      seasonYearTabsContent.push(
        <div className={tabContentClassName} data-tab={year}>
          <LeagueCategory leagues={yearsLeagues}
            onClickLeague={this.props.onClickCategoryFilter}
          />
          <TeamCategory teamsByLeague={leagueTeams}
            onClickTeam={this.props.onClickCategoryFilter}
          />
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
  onClickYearTab: (year) => dispatch(fetchAllFootballLeagueTeams(year)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CategoryFilters);
