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
          />
        </div>
      </div>
    </div>
  </div>
);

const MatchList = ({ matches, selectedMatchId, onSelectMatch }) => (
  <div className="ui raised purple segment" style={{ margin: '0px 10px' }}>
    <h1 className="ui center aligned purple header">Matches</h1>
    {matches.map((match, id) => (
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
          {match.leftTeam.team}
          <h4
            className={`ui horizontal ${selectedMatchId === id && 'inverted'} divider header`}
            style={{ margin: '2px 0px' }}
          >
            VS
          </h4>
          {!match.searchedTeamIsHome && <i className="home icon"></i>}
          {match.rightTeam.team}
        </div>
      </div>
    ))}
  </div>
);

const MatchInformation = ({ leftTeam, rightTeam, searchedTeamIsHome }) => (
  <div className="row">
    <div className="ui raised segment">
      <div className="ui grid">
        <div className="eight wide column">
          <TeamDetails
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
          />
        </div>
        <div className="ui vertical divider" style={{ color: '#a333c8' }}>
          VS
        </div>
        <div className="eight wide column">
          <TeamDetails
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
          />
        </div>
      </div>
    </div>
  </div>
);

const TeamDetails = ({
  homeTeam, rightAligned, name, website, nickName, currentLeague, currentLeagueOriginalPage, abstract,
  groundsOriginalPage, groundsName, groundsCapacity, groundsThumbnailSrc,
  chairman, manager, players, pastLeaguesWon
}) => (
  <div>
    <a
      className={`ui massive purple ${rightAligned ? 'right' : ''} ribbon label`}
      href={website}
      target="_blank"
    >
      {homeTeam && <i className="large home icon" />} {name}
    </a>
    <h2 className="ui header">A.K.A {nickName}</h2>
    <a href={groundsOriginalPage} target="_blank">
      <h2 className="ui center aligned header">
        {groundsName} {groundsCapacity !== 'N/A' && `(${groundsCapacity} seats)`}
      </h2>
      <img
        className="ui centered circular large image"
        src={groundsThumbnailSrc}
        alt={`${name}'s club grounds'`}
      />
    </a>
    <div className="ui raised segment">
      <h3 className="ui header">Club Information</h3>
      <h3 className="ui sub header">
        Current League: <a href={currentLeagueOriginalPage} target="_blank">{currentLeague}</a>
      </h3>
      <br />
      <p>{abstract}</p>
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
        <a href={league.winners.value} target="_blank">
          <h3 className="ui sub header">{league.label.value}</h3>
        </a>
      ))}
    </div>
  </div>
);

const ClubOwnerCard = ({ originalPage, thumbnail, title, name, birthDate, comment }) => (
  <a className="ui purple card" href={originalPage} target="_blank">
    <div className="image">
      <img src={thumbnail} alt={`${name}'`} />
    </div>
    <div className="content">
      <a className="header">{title} - {name}</a>
      <div className="meta">
        <span className="date">Born: {birthDate}</span>
      </div>
      <div className="description">
        {comment}
      </div>
    </div>
  </a>
);

const TeamPlayerList = ({ players }) => (
  <table className="ui very basic collapsing celled purple table">
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
            <tr>
              <td>
                {tryPropertyOrNA(player, 'number')}
              </td>
              <td>
                {playerPosition}
              </td>
              <td>
                {tryPropertyOrNA(player, 'name')}
              </td>
              <td>
                {tryPropertyOrNA(player, 'birthDate')}
              </td>
              <td>
                <div className="ui labeled button">
                  <div className="ui purple button">
                    <i className="add user icon"></i>
                  </div>
                  <a className="ui basic purple left pointing label">
                    Details
                  </a>
                </div>
              </td>
            </tr>
          );
        })
      }
    </tbody>
  </table>
);

export default TeamInformation;
