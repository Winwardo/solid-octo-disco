import React from 'react';
import { Statistic } from '../../../common/common';

const tryOrElse = (thing, property, else_) => {
  try {
    return thing[property].value;
  } catch (e) {
    return else_;
  }
}

const tryOrNa = (thing, property) => {
  return tryOrElse(thing, property, "N/A")
}

const PlayerBox = ({playerInfo}) => {
  const desc = playerInfo.entity.description;
  const details = playerInfo.details;

  return (
    <div style={{float: "left"}}>
      <table className="ui celled purple table">
        <tbody>
          <tr>
            <td colSpan="2">
              <div
                className="ui medium centered bordered rounded image"
                style={{maxHeight: "300px", width:"100%", marginLeft:"auto", marginRight:"auto", overflow:"hidden"}}
              >
                <img
                  src={tryOrElse(desc, "thumbnail", "none")}
                  style={{width:"100%", marginLeft:"auto", marginRight:"auto"}}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td><strong>Full name:</strong></td>
            <td>{desc.fullname.value}</td>
          </tr>
          <tr>
            <td><strong>Birth date:</strong></td>
            <td>{desc.birthdate.value}</td>
          </tr>
          <tr>
            <td><strong>Current team:</strong></td>
            <td><a href={tryOrNa(desc, "currentclub")}>{tryOrNa(desc, "currentclubname")}</a></td>
          </tr>
          <tr>
            <td><strong>Position:</strong></td>
            <td><a href={tryOrNa(desc, "position")}>{tryOrNa(desc, "positionlabel")}</a></td>
          </tr>
          <tr>
            <td><strong>Contracted until:</strong></td>
            <td><abbr title="From http://api.football-data.org/">{details.contractUntil}</abbr></td>
          </tr>
          <tr>
            <td><strong>Market value:</strong></td>
            <td><abbr title="From http://api.football-data.org/">{details.marketValue}</abbr></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
};

const PastTeams = ({teams}) => (
  <div>
    <h2 class="ui header">Past teams</h2>
    <div className="ui relaxed divided list">
      {teams.map((team) => (
        <div className="item">
          <i className="large soccer middle aligned icon"></i>
          <div className="content">
            <a className="header" href={team.team.value}>{team.teamname.value}</a>
            <div className="description">{team.teamcomment.value}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const PlayerInformation = ({playerInfo}) => {
  const desc = playerInfo.entity.description;
  const details = playerInfo.details;

  let height = tryOrNa(desc, "height");
  if (height !== "N/A") {
    height /= 100;
  }

  console.log(playerInfo)

  return (
    <div className="container" style={{marginLeft: "auto", marginRight: "auto"}}>
      <div className="ui grid">
        <div className="six wide column">
          <PlayerBox playerInfo={playerInfo} style={{float: "left"}}/>
        </div>
        <div className="ten wide column">
          <div>
            <h1 className="ui header" style={{textAlign: "center", fontSize: "3em"}}>
              <a href={desc.player.value}>
                {playerInfo.query}
              </a>
              <div className="sub header">{tryOrElse(desc, "quote", "")}</div>
            </h1>
            <div className="ui statistics three column grid" style={{width: "100%"}}>
              <Statistic label="Caps" value={tryOrNa(desc, "caps")} className="column" />
              <Statistic label="Goals" value={tryOrNa(desc, "goals")} className="column" />
              <Statistic label="Height (metres)" value={height} className="column" />
            </div>
          </div>
          <div style={{height: "32px"}} />
          <div>
            {playerInfo.entity.description.abstract.value}
            <div style={{height: "16px"}} />
            For more information, please see <a href={desc.player.value}>{desc.player.value}</a>.
          </div>
        </div>
      </div>
      <div style={{height: "48px"}} />
      <PastTeams teams={playerInfo.entity.teams} />
    </div>
  );
};

export default PlayerInformation;
