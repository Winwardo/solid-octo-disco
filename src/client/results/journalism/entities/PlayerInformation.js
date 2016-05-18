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
      <table className="ui compact celled table">
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
            <td><strong>Current football team:</strong></td>
            <td><a href={tryOrNa(desc, "currentclub")}>{tryOrNa(desc, "currentclubname")}</a></td>
          </tr>
          <tr>
            <td><strong>Position:</strong></td>
            <td><a href={tryOrNa(desc, "position")}>{tryOrNa(desc, "positionlabel")}</a></td>
          </tr>
          <tr>
            <td><strong>Contracted until:</strong></td>
            <td>{details.contractUntil}</td>
          </tr>
          <tr>
            <td><strong>Market value:</strong></td>
            <td>{details.marketValue}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
};

const PlayerInformation = ({playerInfo}) => {
  const desc = playerInfo.entity.description;
  const details = playerInfo.details;

  console.log(playerInfo)

  return (
    <div className="container">
      <h1>
        <a href={desc.player.value}>
          {playerInfo.query}
        </a>
      </h1>
      <h2>{tryOrElse(desc, "quote", "")}</h2>
      <PlayerBox playerInfo={playerInfo} style={{float: "left"}}/>
      <div>
        <div className="ui statistics">
          <Statistic label="Caps" value={tryOrNa(desc, "caps")} />
          <Statistic label="Goals" value={tryOrNa(desc, "goals")} />
          <Statistic label="Height (cm)" value={tryOrNa(desc, "height")} />
        </div>
        {playerInfo.entity.description.abstract.value}
      </div>
    </div>
  );
};

export default PlayerInformation;
