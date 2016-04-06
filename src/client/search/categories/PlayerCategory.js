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
    const isFetchingLoader = (
      <i className="purple icon">
        <div className="ui active inline loader"></div>
      </i>
    );
    return (
      <div className="ui dropdown labeled icon button players">
        <span className="text">
          <img className="ui small image" src={this.props.teamCrestUrl} />
          {this.props.teamName} Players
        </span>
        {this.props.teamPlayers.length === 0 ? isFetchingLoader : <i className="soccer purple icon"></i>}
        <div className="menu">
          <div className="ui icon search input">
            <i className="search icon"></i>
            <input type="text" placeholder="Search players..." />
          </div>
          {this.props.teamPlayers.map(player => (
            <div className="item player" onClick={() => this.props.onClickPlayer(player.name)}>
              <i className={`${getSemanticCountryFlagName(player.nationality.toLowerCase())} flag`} />
              {player.name}
              <div className="ui right floated">
                <i className="add green circle icon float right"></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
PlayerCategory.propTypes = {
  teamName: React.PropTypes.string,
  teamCrestUrl: React.PropTypes.string,
  teamPlayers: React.PropTypes.array,
  onClickPlayer: React.PropTypes.func
};

export default PlayerCategory;
