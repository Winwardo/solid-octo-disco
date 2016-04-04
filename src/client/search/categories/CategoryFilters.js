import React, { Component } from 'react';
import YearSelector from './YearSelector';
import { connect } from 'react-redux';
import moment from 'moment';

class CategoryFilters extends Component {
  componentDidMount() {
    $('.menu .item').tab();
  }

  componentDidUpdate() {
    $('.menu .item').tab();
  }

  render() {
    const currentYear = moment().year();
    let seasonYearTabsContent = [];
    for (let year in this.props.football.seasonsByYear) {
      const tabContentClassName =
        year === currentYear ? 'ui bottom attached active tab segment' : 'ui bottom attached tab segment';
      seasonYearTabsContent.push(
        <div className={tabContentClassName} data-tab={year}>
          Year: {year}s content
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
};

const mapStateToProps = (state) => ({ football: state.football });

export default connect(mapStateToProps)(CategoryFilters);
