import React, { Component } from 'react';
import { getSemanticCountryFlagName } from './../../../shared/utilities';
import { PLAYER_ENTITY } from '../searchActions';

class PlayerCategory extends Component {
  componentDidMount() {
    $('.ui.dropdown.players').dropdown({
      action: 'nothing',
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.teamPlayers !== this.props.teamPlayers) {
      if ($('.ui.dropdown.players').dropdown('is hidden')) {
        $('.ui.dropdown.players').dropdown('show');
      }
    }
  }

  render() {
    return (
      <div className="ui labeled">
        <div className="ui dropdown labeled icon button players category">
          <span className="text">
            <img className="ui small image" src={this.props.teamCrestUrl} />
            {this.props.teamName} Players
          </span>
          {
            this.props.isTeamPlayersFetching ?
              <i className="icon">
                <div className="ui active inline loader"></div>
              </i>
            :
              <i className="soccer purple icon"></i>
          }
          <div className="menu">
            <div className="ui icon search input">
              <i className="search icon"></i>
              <input type="text" placeholder="Search players..." />
            </div>
            {this.props.teamPlayers.map(player => {
              const searchesQueriesSameAsPlayer = this.props.currentSearchTerms
              .filter((searchTerm) => searchTerm.query === player.name);
              const playerAlreadyAddedToSearch = searchesQueriesSameAsPlayer.length > 0;

              return (
                <TeamPlayer key={`player${player.id}`} name={player.name}
                  alreadyAddedToSearch={playerAlreadyAddedToSearch}
                  nationality={player.nationality.toLowerCase()}
                  onClick={() => {
                    if (playerAlreadyAddedToSearch) {
                      searchesQueriesSameAsPlayer.forEach(
                      search => this.props.onClickRemovePlayer(search.id)
                      );
                    } else {
                      this.props.onClickAddPlayer(player.name, PLAYER_ENTITY, {
                        playerNationality: player.nationality.toLowerCase(),
                        marketValue: player.marketValue,
                        contractUntil: player.contractUntil,
                        position: player.position,
                      });
                    }
                  }}
                />
              );
            }
            )}
          </div>
        </div>
        {
          !this.props.isTeamPlayersFetching &&
            <div className="ui purple left pointing label">
              {this.props.teamPlayers.length}
            </div>
        }
      </div>
    );
  }
}
PlayerCategory.propTypes = {
  teamName: React.PropTypes.string,
  teamCrestUrl: React.PropTypes.string,
  isTeamPlayersFetching: React.PropTypes.bool,
  teamPlayers: React.PropTypes.array,
  currentSearchTerms: React.PropTypes.array,
  onClickAddPlayer: React.PropTypes.func,
  onClickRemovePlayer: React.PropTypes.func,
};

const TeamPlayer = ({ name, nationality, alreadyAddedToSearch, onClick }) => (
  <div className="item player" onClick={() => onClick(name, PLAYER_ENTITY)}>
    <i className={`${getSemanticCountryFlagName(nationality)} flag`} />
    {name}
    <div className="ui right floated">
      {
        alreadyAddedToSearch ?
          <i className="remove red circle icon float right"></i>
        :
          <i className="add green circle icon float right"></i>
      }
    </div>
  </div>
);

export default PlayerCategory;
