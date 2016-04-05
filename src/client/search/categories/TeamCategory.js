import React, { Component } from 'react';

class TeamCategory extends Component {
  componentDidMount() {
    $('.ui.dropdown.teams').dropdown({
      action: 'nothing',
    });
    $('.ui.accordion.teams').accordion();
  }

  render() {
    return (
      <div className="ui dropdown labeled icon button teams">
        <i className="users purple icon"></i>
        <span className="text">Teams...</span>
        <div className="menu">
          {/*<div className="ui icon search input">
            <i className="search icon"></i>
            <input type="text" placeholder="Search tags..." />
          </div>*/}
          <div className="ui accordion teams">
            {this.props.teamsByLeague.map(league => (
              <div>
                <div className="title">
                  <i className="dropdown icon"></i>
                  {league.name.slice(0, league.name.length - 7)}
                </div>
                <div className="content">
                  <div className="items">
                    {league.teams.map(team => (
                      <div className="item" onClick={() => this.props.onClickTeam(team.name)}>
                        <img className="ui avatar image" src={team.crestUrl} />
                        {team.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
