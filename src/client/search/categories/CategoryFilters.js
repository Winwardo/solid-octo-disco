import React, { Component } from 'react';
import YearSelector from './YearSelector';
import { connect } from 'react-redux';
import LeagueCategory from './LeagueCategory';
import moment from 'moment';
import { addSearchTerm } from './../searchActions';

class CategoryFilters extends Component {
  componentDidMount() {
    $('.menu .item').tab();
  }

  componentDidUpdate() {
    $('.menu .item').tab();
  }

  render() {
    const currentYear = `${moment().year()}`;
    let seasonYearTabsContent = [];
    for (let year in this.props.football.seasonsByYear) {
      const tabContentClassName =
        year === currentYear ? 'ui bottom attached active tab segment' : 'ui bottom attached tab segment';
      seasonYearTabsContent.push(
        <div className={tabContentClassName} data-tab={year}>
          <LeagueCategory leagues={this.props.football.seasonsByYear[year].seasons}
            onClickLeague={this.props.onClickCategoryFilter}
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CategoryFilters);
