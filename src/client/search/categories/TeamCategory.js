import React, { Component } from 'react';
import { TEAM_ENTITY } from '../searchActions';

class TeamCategory extends Component {
  componentDidMount() {
    $('.ui.dropdown.teams').dropdown({
      action: 'nothing',
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
      <div className="large fluid ui dropdown labeled icon button teams category">
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
              <LeagueTeamsList key={`leagueteams${league.id}`} id={league.id}
                name={league.name.slice(0, league.name.length - 7)}
                teams={league.teams} currentSearchTerms={this.props.currentSearchTerms}
                onClickAddTeam={this.props.onClickAddTeam}
                onClickRemoveTeam={this.props.onClickRemoveTeam}
                onClickSelectTeam={this.props.onClickSelectTeam}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
TeamCategory.propTypes = {
  teamsByLeague: React.PropTypes.object,
  currentSearchTerms: React.PropTypes.array,
  onClickAddTeam: React.PropTypes.func,
  onClickRemoveTeam: React.PropTypes.func,
  onClickSelectTeam: React.PropTypes.func,
};

const LeagueTeamsList = ({
  id, name, teams, currentSearchTerms, onClickAddTeam, onClickRemoveTeam, onClickSelectTeam,
}) => (
  <div data-id={id} className="league section">
    <div className="title">
      <i className="dropdown icon"></i>
      {name}
      <div className="ui purple horizontal basic label" style={{ float: 'right' }}>
        <span data-id={id} className="league count">{teams.length}</span>
      </div>
    </div>
    <div className="content">
      <div className="items">
        {teams.map(team => {
          const searchesQueriesSameAsTeam = currentSearchTerms
          .filter(
          (searchTerm) => searchTerm.query === team.name || searchTerm.query === team.shortName
          );
          const teamAlreadyAddedToSearch = searchesQueriesSameAsTeam.length > 0;
          return (
            <LeagueTeam key={`league${id}team${team.id}`}
              leagueId={id} name={team.name} crestUrl={team.crestUrl}
              alreadyAddedToSearch={teamAlreadyAddedToSearch}
              onClickTeam={() => {
                if (teamAlreadyAddedToSearch) {
                  searchesQueriesSameAsTeam.forEach(
                  search => onClickRemoveTeam(search.id)
                  );
                } else {
                  onClickAddTeam(`^#${team.name}`, TEAM_ENTITY, {
                    footballDataOrgTeamId: team.id,
                    shortName: team.shortName,
                    crestUrl: team.crestUrl,
                    squadMarketValue: team.squadMarketValue,
                  });
                  onClickAddTeam(`#${team.shortName}`, false);
                }
              }}
              onClickSelectTeam={() =>
                onClickSelectTeam(team.id, team.name, team.shortName, team.crestUrl)
              }
            />
          );
        })}
      </div>
    </div>
  </div>
);

const LeagueTeam = ({
  leagueId, name, crestUrl, alreadyAddedToSearch, onClickTeam, onClickSelectTeam,
}) => (
  <div
    data-id={leagueId} className="league item"
    style={{ cursor: 'pointer' }}
    onClick={() => onClickTeam()}
  >
    <div className="ui three column grid">
      <div className="column">
        <img className="ui avatar image" src={crestUrl} />
        {name}
      </div>

      <div className="center aligned column">
        {
          alreadyAddedToSearch ?
            <i className="remove red circle icon float right"></i>
          :
            <i className="add green circle icon float right"></i>
        }
      </div>

      <div className="column">
        <div className="mini ui fluid right floated purple button"
          onClick={(e) => {
            e.stopPropagation();
            $('.ui.dropdown.teams').dropdown('hide');
            onClickSelectTeam();
          }}
        >
          {name} Players
          <i className="right chevron icon"></i>
        </div>
      </div>
    </div>
  </div>
);

export default TeamCategory;
