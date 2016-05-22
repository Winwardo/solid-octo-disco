import React from 'react';
import moment from 'moment';
import { tryPropertyOrElse, tryPropertyOrNA } from '../../../../shared/utilities';

const TeamInformation = ({ matches, selectedMatchId, onSelectMatch }) => (
  <div>
    <div className="row">
      <div className="ui grid">
        <div className="four wide column">
          <MatchList
            matches={matches}
            selectedMatchId={selectedMatchId}
            onSelectMatch={onSelectMatch}
          />
        </div>
        <div className="twelve wide column">
          <MatchInformation
            leftTeam={matches[selectedMatchId].leftTeam}
            rightTeam={matches[selectedMatchId].rightTeam}
            searchedTeamIsHome={matches[selectedMatchId].searchedTeamIsHome}
            result={matches[selectedMatchId].fixtureInfo.result}
            status={matches[selectedMatchId].fixtureInfo.status}
          />
        </div>
      </div>
    </div>
  </div>
);

const MatchList = ({ matches, selectedMatchId, onSelectMatch }) => (
  <div className="ui raised purple segment" style={{ margin: '0px 10px' }}>
    <h1 className="ui center aligned purple header">Matches</h1>
    {
      matches.map((match, id) => {
        let leftTeamGoals = '';
        let rightTeamGoals = '';

        if (match.fixtureInfo.status === 'FINISHED') {
          if (match.searchedTeamIsHome) {
            leftTeamGoals = match.fixtureInfo.result.goalsHomeTeam;
            rightTeamGoals = match.fixtureInfo.result.goalsAwayTeam;
          } else {
            leftTeamGoals = match.fixtureInfo.result.goalsAwayTeam;
            rightTeamGoals = match.fixtureInfo.result.goalsHomeTeam;
          }
        }

        return (
          <div
            key={`match${id}`}
            className="ui left labeled fluid button" style={{ marginBottom: '7px' }}
            onClick={() => onSelectMatch(id)}
          >
            <div className={`ui basic right pointing ${selectedMatchId === id && 'purple'} label`}>
              {moment(match.fixtureInfo.date).format('DD/MM/YY')}
            </div>
            <div className={`ui left aligned fluid ${selectedMatchId === id && 'purple'} button`}>
              {match.searchedTeamIsHome && <i className="home icon"></i>}
              {match.leftTeam.team} - {leftTeamGoals}
              <h4
                className={`ui horizontal ${selectedMatchId === id && 'inverted'} divider header`}
                style={{ margin: '2px 0px' }}
              >
                VS
              </h4>
              {!match.searchedTeamIsHome && <i className="home icon"></i>}
              {match.rightTeam.team} - {rightTeamGoals}
            </div>
          </div>
        );
      })
    }
  </div>
);

const MatchInformation = ({ leftTeam, rightTeam, searchedTeamIsHome, result, status }) => {
  let leftTeamGoals = '';
  let rightTeamGoals = '';

  if (status === 'FINISHED') {
    if (searchedTeamIsHome) {
      leftTeamGoals = result.goalsHomeTeam;
      rightTeamGoals = result.goalsAwayTeam;
    } else {
      leftTeamGoals = result.goalsAwayTeam;
      rightTeamGoals = result.goalsHomeTeam;
    }
  }
  return (
    <div className="row">
      <div className="ui raised segment">
        <h1 className="ui center aligned purple header" style={{ marginTop: '5px' }}>
          <div className="ui massive center aligned purple label">
            {leftTeamGoals} : {rightTeamGoals}
          </div>
        </h1>
        <div className="ui grid">
          <div className="eight wide column">
            {console.log("leftTeam", leftTeam)}
            <TeamDetails
              originalResource={leftTeam.clubInfo.team.value}
              homeTeam={searchedTeamIsHome}
              name={leftTeam.team}
              website={tryPropertyOrElse(leftTeam.clubInfo, 'website', '')}
              nickName={tryPropertyOrElse(leftTeam.clubInfo, 'nickname', 'unknown nickname')}
              groundsOriginalPage={tryPropertyOrElse(leftTeam.groundsInfo, 'grounds', '')}
              groundsName={tryPropertyOrNA(leftTeam.groundsInfo, 'groundname')}
              groundsCapacity={tryPropertyOrNA(leftTeam.groundsInfo, 'capacity')}
              groundsThumbnailSrc={tryPropertyOrElse(leftTeam.groundsInfo, 'thumbnail', '')}
              currentLeagueOriginalPage={tryPropertyOrNA(leftTeam.clubInfo, 'league')}
              currentLeague={tryPropertyOrNA(leftTeam.clubInfo, 'label')}
              abstract={tryPropertyOrNA(leftTeam.clubInfo, 'abstract')}
              chairman={leftTeam.chairman}
              manager={leftTeam.manager}
              players={leftTeam.players}
              pastLeaguesWon={leftTeam.leaguesWon}
              key={leftTeam.team}
            />
          </div>
          <div className="ui vertical divider" style={{ color: '#a333c8' }}>
            VS
          </div>
          <div className="eight wide column">
            <TeamDetails
              originalResource={rightTeam.clubInfo.team.value}
              homeTeam={!searchedTeamIsHome}
              rightAligned={true}
              name={rightTeam.team}
              website={tryPropertyOrElse(rightTeam.clubInfo, 'website', '')}
              nickName={tryPropertyOrElse(rightTeam.clubInfo, 'nickname', 'unknown nickname')}
              groundsOriginalPage={tryPropertyOrElse(rightTeam.groundsInfo, 'grounds', '')}
              groundsName={tryPropertyOrNA(rightTeam.groundsInfo, 'groundname')}
              groundsCapacity={tryPropertyOrNA(rightTeam.groundsInfo, 'capacity')}
              groundsThumbnailSrc={tryPropertyOrElse(rightTeam.groundsInfo, 'thumbnail', '')}
              currentLeagueOriginalPage={tryPropertyOrNA(rightTeam.clubInfo, 'league')}
              currentLeague={tryPropertyOrNA(rightTeam.clubInfo, 'label')}
              abstract={tryPropertyOrNA(rightTeam.clubInfo, 'abstract')}
              chairman={rightTeam.chairman}
              manager={rightTeam.manager}
              players={rightTeam.players}
              pastLeaguesWon={rightTeam.leaguesWon}
              key={rightTeam.team}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const TeamDetails = ({
  originalResource, homeTeam, rightAligned, name, website, nickName, currentLeague,
  currentLeagueOriginalPage, abstract, groundsOriginalPage, groundsName,
  groundsCapacity, groundsThumbnailSrc, chairman, manager, players, pastLeaguesWon
}) => (
  <div typeof="http://dbpedia.org/ontology/SoccerClub">
    <a
      className={`ui massive purple ${rightAligned ? 'right' : ''} ribbon label`}
      href={website}
      target="_blank"
      property="http://www.w3.org/2000/01/rdf-schema#label"
    >
      {homeTeam && <i className="large home icon" /> || <div style={{height: "36px", width: "1px", display: "inline-block"}}>&nbsp;</div> } {name}
    </a>
    <h2 className="ui header" property="http://dbpedia.org/property/nickname">A.K.A {nickName}</h2>
    <a href={groundsOriginalPage} target="_blank" property="http://dbpedia.org/ontology/ground" typeof="http://dbpedia.org/ontology/Stadium">
      <h2 className="ui center aligned header">
        <span property="http://dbpedia.org/property/name">{groundsName}</span>
        <span className="ui sub header">
        {
            <span property="http://dbpedia.org/ontology/seatingCapacity">({groundsCapacity} seats)</span>
        }
        </span>
      </h2>
      <div style={{maxHeight: "300px", height: "300px"}}>
        <img
          className="ui centered circular image"
          src={groundsThumbnailSrc || "/public/images/nogrounds.jpg"}
          alt={`${name}'s club grounds'`}
          property="http://dbpedia.org/ontology/thumbnail"
          style={{height: "100%"}}
        />
      </div>
    </a>
    <div className="ui raised segment">
      <h3 className="ui header">Club Information</h3>
      <h3 className="ui sub header" property="http://dbpedia.org/ontology/league" typeof="http://dbpedia.org/ontology/SportsLeague">
        Current League:
        <a href={currentLeagueOriginalPage} target="_blank" property="http://www.w3.org/2000/01/rdf-schema#label">
          {currentLeague}
        </a>
      </h3>
      <br />
      <p property="http://dbpedia.org/ontology/abstract">{abstract}</p>
      <p>
        Information collected from <a href={originalResource}>{originalResource}</a>.
      </p>
    </div>

    <div className="ui raised segment">
      <h3 className="ui header">Current Club</h3>
      <div className="ui cards">
        {
          <ClubOwnerCard
            originalPage={tryPropertyOrElse(chairman[0], 'chairman', '')}
            thumbnail={tryPropertyOrElse(chairman[0], 'thumbnail', 'public/images/defaultUser.png')}
            title={'Chairman'}
            name={tryPropertyOrElse(chairman[0], 'name', 'N/A')}
            birthDate={tryPropertyOrElse(chairman[0], 'birthDate', 'N/A')}
            comment={tryPropertyOrElse(chairman[0], 'comment', 'No extra information available')}
            entitytypeof="http://dbpedia.org/ontology/chairman"
          />
        }
        {manager.map(clubOwner => (
          <ClubOwnerCard
            originalPage={tryPropertyOrElse(clubOwner, 'manager', '')}
            thumbnail={tryPropertyOrElse(clubOwner, 'thumbnail', 'public/images/defaultUser.png')}
            title={'Manager'}
            name={tryPropertyOrNA(clubOwner, 'name')}
            birthDate={tryPropertyOrNA(clubOwner, 'birthDate')}
            comment={tryPropertyOrElse(clubOwner, 'comment', 'No extra information available')}
            entitytypeof="http://dbpedia.org/ontology/manager"
          />
        ))}
      </div>
      <br />
      <h3 className="ui header">Players</h3>
      <TeamPlayerList players={players} />
    </div>

    <div className="ui raised segment">
      <h3 className="ui header">
        <i className="yellow trophy icon"></i>
        Past Leagues Won
      </h3>
      {pastLeaguesWon.map(league => (
        <a href={league.winners.value} target="_blank" property="http://dbpedia.org/property/winners" typeof="http://dbpedia.org/ontology/FootballLeagueSeason">
          <h3 className="ui sub header" property="http://www.w3.org/2000/01/rdf-schema#label">{league.label.value}</h3>
        </a>
      ))}
    </div>
  </div>
);

const ClubOwnerCard = ({ originalPage, thumbnail, title, name, birthDate, comment, entitytypeof }) => (
  <a className="ui purple card" href={originalPage} target="_blank" property={entitytypeof} typeof="http://dbpedia.org/ontology/Agent">
    <div className="image">
      <img src={thumbnail} alt={`${name}'`} property="http://dbpedia.org/ontology/thumbnail" />
    </div>
    <div className="content">
      <span className="header">{title} - <span property="http://dbpedia.org/property/fullname">{name}</span></span>
      <div className="meta">
        <span className="date">Born: <span property="http://dbpedia.org/property/birthDate">{birthDate}</span></span>
      </div>
      <div className="description" property="http://www.w3.org/2000/01/rdf-schema#comment">
        {comment}
      </div>
    </div>
  </a>
);

const TeamPlayerList = ({ players }) => (
  <table className="ui very basic celled purple table">
    <thead>
      <tr>
        <th>Number</th>
        <th>Position</th>
        <th>Name</th>
        <th>Birthdate</th>
      </tr>
    </thead>
    <tbody>
      {
        players.map(player => {
          // alot of the position definitions have '(football association)' which
          // is unnecessary details so remove them if it exists, otherwise use rawPosition.
          const playerPositionRaw = tryPropertyOrNA(player, 'positionLabel');
          let playerPosition = playerPositionRaw
          .substring(0, playerPositionRaw.indexOf('('));

          if (!playerPosition) {
            playerPosition = playerPositionRaw;
          }
          return (
            <tr property="http://dbpedia.org/property/currentclub" typeof="http://dbpedia.org/ontology/SoccerPlayer">
              <td property="http://dbpedia.org/ontology/number">
                {tryPropertyOrNA(player, 'number')}
              </td>
              <td property="http://dbpedia.org/ontology/position" typeof="http://dbpedia.org/ontology/position">
                <a href={tryPropertyOrElse(player, 'position', '')} target="_blank" property="http://www.w3.org/2000/01/rdf-schema#label">
                  {playerPosition}
                </a>
              </td>
              <td>
                <a href={tryPropertyOrElse(player, 'player', '')} target="_blank" property="http://dbpedia.org/property/fullname">
                  {tryPropertyOrNA(player, 'name')}
                </a>
              </td>
              <td property="http://dbpedia.org/ontology/birthDate">
                {tryPropertyOrNA(player, 'birthDate')}
              </td>
            </tr>
          );
        })
      }
    </tbody>
  </table>
);

export default TeamInformation;
