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
      <div className="large ui fluid dropdown labeled icon button teams">
        {isFetching || leagueTeams.length === 0 ? loaderIcon : <i className="users purple icon"></i>}
        <span className="text">Teams...</span>
        <div className="menu">
          <div className="ui icon search input">
            <i className="search icon"></i>
            <input type="text" placeholder="Search Teams..." onChange={(e) => {
              const inputLength = e.target.value.length;

              // setting very little timeout so that the below happens after
              // the class names have have changed properly
              leagueTeams.forEach((league) => {
                setTimeout(() => {
                  // Assume all leagues don't have teams showing
                  let hasUnfilteredTeams = false;
                  let leaguesShowing = 0;

                  // For every team in the league with id
                  $(`.league.item[data-id="${league.id}"]`).each((i, team) => {
                    // check if it doesn't have the filtered class
                    if (!$(team).hasClass('filtered')) {
                      // which means that all the teams aren't filtered
                      leaguesShowing++;
                      hasUnfilteredTeams = true;
                    }
                  });

                  // if the league has showing teams remove the filtered class to hide them
                  // otherwise add a class to hide that league.
                  if (hasUnfilteredTeams) {
                    $(`.league.section[data-id="${league.id}"]`).removeClass('item filtered');
                    const totalLeagues = $(`.league.item[data-id="${league.id}"]`).length;
                    if (inputLength === 0) {
                      $(`.league.count[data-id="${league.id}"]`).text(totalLeagues);
                    } else {
                      $(`.league.count[data-id="${league.id}"]`).text(`${leaguesShowing} / ${totalLeagues}`);
                    }
                  } else {
                    $(`.league.section[data-id="${league.id}"]`).addClass('item filtered');
                  }
                }, 20);
              });
            }} />
          </div>
          <div className="ui styled accordion teams">
            {leagueTeams.map(league => (
              <div key={`leagueteams${league.id}`} data-id={league.id} className="league section">
                <div className="title">
                  <i className="dropdown icon"></i>
                  {league.name.slice(0, league.name.length - 7)}
                  <div className="ui purple horizontal basic label" style={{ float: 'right' }}>
                    <span data-id={league.id} className="league count">{league.teams.length}</span>
                  </div>
                </div>
                <div className="content">
                  <div className="items">
                    {league.teams.map(team => (
                      <div key={`league${league.id}team${team.id}`}
                        data-id={league.id} className="league item"
                        style={{ cursor: 'pointer' }}
                        onClick={() => this.props.onClickAddTeam(team.shortName)}
                      >
                        <div className="ui three column grid">
                          <div className="column">
                            <img className="ui avatar image" src={team.crestUrl} />
                            {team.name}
                          </div>

                          <div className="center aligned column">
                            <i className="add green circle icon float right"></i>
                          </div>

                          <div className="column">
                            <div className="mini ui right floated purple button"
                              onClick={(e) => {
                                e.stopPropagation();
                                this.props.onClickSelectTeam(
                                team.id, team.name, team.shortName, team.crestUrl
                                );
                              }}
                            >
                              {team.name} Players
                              <i className="right chevron icon"></i>
                            </div>
                          </div>
                        </div>
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
  onClickSelectTeam: React.PropTypes.func,
};

export default TeamCategory;
