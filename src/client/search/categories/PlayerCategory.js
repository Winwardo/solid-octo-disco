import React, { Component } from 'react';
import { getSemanticCountryFlagName } from './../../../shared/utilities';

class PlayerCategory extends Component {
  componentDidMount() {
    $('.ui.dropdown.players').dropdown({
      action: 'nothing',
    });
  }

  componentDidUpdate() {
    if ($('.ui.dropdown.players').dropdown('is hidden')) {
      $('.ui.dropdown.players').dropdown('show');
    }
  }

  render() {
    return (
      <div className="ui labeled button">
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
            {this.props.teamPlayers.map(player =>
              <TeamPlayer key={`player${player.id}`} name={player.name}
                nationality={player.nationality.toLowerCase()} onClick={this.props.onClickPlayer}
              />
            )}
          </div>
        </div>
        { !this.props.isTeamPlayersFetching &&
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
  isTeamPlayersFetching: React.PropTypes.boolean,
  teamPlayers: React.PropTypes.array,
  onClickPlayer: React.PropTypes.func,
};

const TeamPlayer = ({ name, nationality, onClick }) => (
  <div className="item player" onClick={() => onClick(name)}>
    <i className={`${getSemanticCountryFlagName(nationality)} flag`} />
    {name}
    <div className="ui right floated">
      <i className="add green circle icon float right"></i>
    </div>
  </div>
);

export default PlayerCategory;
