import React from 'react';
import moment from 'moment';
import { Statistic } from '../../../common/common';

const tryPropertyOrElse = (object, property, else_) => {
  try {
    return object[property].value;
  } catch (e) {
    return else_;
  }
}

const tryPropertyOrNA = (object, property) => (
  tryPropertyOrElse(object, property, "N/A")
)

const PlayerBox = ({playerInfo}) => {
  const desc = playerInfo.entity.description;
  const details = playerInfo.details;

  const age = moment().diff(tryPropertyOrElse(desc, "birthdate", "2000-01-01"), 'years');

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
                  src={tryPropertyOrElse(desc, "thumbnail", "none")}
                  style={{width:"100%", marginLeft:"auto", marginRight:"auto"}}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td><strong>Full name:</strong></td>
            <td><span property="http://dbpedia.org/property/fullname">{tryPropertyOrNA(desc, "fullname")}</span></td>
          </tr>
          <tr>
            <td><strong>Birth date:</strong></td>
            <td><span property="http://dbpedia.org/property/birthDate">{tryPropertyOrNA(desc, "birthdate")}</span> ({age} years old)</td>
          </tr>
          <tr>
            <td><strong>Nationality:</strong></td>
            <td><i className={`${details.playerNationality} flag`} /><span property="https://schema.org/nationality">{details.nationality}</span></td>
          </tr>
          <tr>
            <td><strong>Current team:</strong></td>
            <td><a href={tryPropertyOrNA(desc, "currentclub")} property="http://dbpedia.org/property/currentclub">{tryPropertyOrNA(desc, "currentclubname")}</a></td>
          </tr>
          <tr>
            <td><strong>Position:</strong></td>
            <td><a href={tryPropertyOrNA(desc, "position")} property="http://dbpedia.org/ontology/position">{tryPropertyOrNA(desc, "positionlabel")}</a></td>
          </tr>
          <tr>
            <td><strong>Contracted until:</strong></td>
            <td><span property="https://schema.org/endDate"><abbr title="From http://api.football-data.org/">{details.contractUntil}</abbr></span></td>
          </tr>
          <tr>
            <td><strong>Market value:</strong></td>
            <td typeof="https://schema.org/MonetaryAmount"><span property="https://schema.org/value"><abbr title="From http://api.football-data.org/">{details.marketValue}</abbr></span></td>
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
        <div className="item" typeof="http://dbpedia.org/ontology/team">
          <i className="large soccer middle aligned icon"></i>
          <div className="content">
            <a className="header" href={tryPropertyOrNA(team, "team")} property="rdfs:label">{tryPropertyOrNA(team, "teamname")}</a>
            <div className="description" property="rdfs:comment">{tryPropertyOrNA(team, "teamcomment")}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const PlayerInformation = ({playerInfo}) => {
  const desc = playerInfo.entity.description;
  const details = playerInfo.details;

  let height = tryPropertyOrNA(desc, "height");
  if (height !== "N/A") {
    height /= 100;
  }

  return (
    <div className="container" style={{marginLeft: "auto", marginRight: "auto"}} typeof="http://dbpedia.org/ontology/SoccerPlayer">
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
              <div className="sub header">{tryPropertyOrElse(desc, "quote", "")}</div>
            </h1>
            <div className="ui statistics three column grid" style={{width: "100%"}}>
              <Statistic label="Caps" value={tryPropertyOrNA(desc, "caps")} className="column" property="http://dbpedia.org/property/caps"/>
              <Statistic label="Goals" value={tryPropertyOrNA(desc, "goals")} className="column" property="http://dbpedia.org/property/goals"/>
              <Statistic label="Height (metres)" value={height.toFixed(2)} className="column" property="http://dbpedia.org/ontology/Person/height"/>
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
