import React, { Component } from 'react';

class TeamCategory extends Component {
  componentDidMount() {
    $('.ui.dropdown.teams').dropdown({
      action: 'hide',
    });
    $('.ui.accordion.teams').accordion();
  }

  render() {
    let leagueTeams = [];
    let isFetching = false;
    const loaderIcon = <i className="purple icon"><div className="ui active inline loader"></div></i>;
    // checks if teamsByLeague exist and have been fetched
    if (this.props.teamsByLeague) {
      if (!this.props.teamsByLeague.isFetching) {
        leagueTeams = this.props.teamsByLeague.leagues;
        isFetching = false;
      } else {
        isFetching = true;
      }
    }

    return (
      <div className="ui dropdown labeled icon button teams">
        {isFetching || leagueTeams.length === 0 ? loaderIcon : <i className="users purple icon"></i>}
        <span className="text">Teams...</span>
        <div className="menu">
          <div className="ui icon search input">
            <i className="search icon"></i>
            <input type="text" placeholder="Search Teams..." onChange={() => {
              leagueTeams.forEach((league) => {
                // Assume all leagues don't have teams showing
                let hasUnfilteredTeams = false;
                // For every team in the league with id
                $(`.league.item[data-id="${league.id}"]`).each((i, team) => {
                  // check if it doesn't have the filtered class
                  if (!$(team).hasClass('filtered')) {
                    // which means that all the teams aren't filtered
                    hasUnfilteredTeams = true;
                  }
                });

                // if the league has showing teams remove the filtered class to hide them
                // otherwise add a class to hide that league.
                if (hasUnfilteredTeams) {
                  $(`.league.section[data-id="${league.id}"]`).removeClass('item filtered');
                } else {
                  $(`.league.section[data-id="${league.id}"]`).addClass('item filtered');
                }
              });
            }} />
          </div>
          <div className="ui styled accordion teams">
            {leagueTeams.map(league => (
              <div data-id={league.id} className="league section">
                <div className="title">
                  <i className="dropdown icon"></i>
                  {league.name.slice(0, league.name.length - 7)}
                </div>
                <div className="content">
                  <div className="items">
                    {league.teams.map(team => (
                      <div data-id={league.id} className="league item"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          const teamId = team._links.players.href.match(/\/v1\/teams\/(\d*?)\/players/)[1];
                          this.props.onClickAddTeam(team.shortName);
                          this.props.onClickSelectTeam(
                            teamId, team.name, team.shortName, team.crestUrl
                          );
                        }}
                      >
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
  onClickAddTeam: React.PropTypes.func,
  onClickSelectTeam: React.PropTypes.func
};

export default TeamCategory;
