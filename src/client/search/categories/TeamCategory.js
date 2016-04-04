import React, { Component } from 'react';

class TeamCategory extends Component {
  componentDidMount() {
    $('.ui.dropdown.teams').dropdown({
      action: 'nothing',
    });
  }

  render() {
    return (
      <div className="ui dropdown labeled icon button teams">
        <i className="users purple icon"></i>
        <span className="text">Teams...</span>
        <div className="menu">
          <div className="ui icon search input">
            <i className="search icon"></i>
            <input type="text" placeholder="Search tags..." />
          </div>
          {}
        </div>
      </div>
    );
  }
}
TeamCategory.propTypes = {
  teamsByLeague: React.PropTypes.object,
  onClickTeam: React.PropTypes.func,
};

export default TeamCategory;
