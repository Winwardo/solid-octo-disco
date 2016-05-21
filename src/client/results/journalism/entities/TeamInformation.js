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
            groundsName={tryPropertyOrNA(leftTeam.groundsInfo, 'groundname')}
            groundsCapacity={tryPropertyOrNA(leftTeam.groundsInfo, 'capacity')}
            groundsThumbnailSrc={tryPropertyOrElse(leftTeam.groundsInfo, 'thumbnail', '')}
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
            groundsName={tryPropertyOrNA(rightTeam.groundsInfo, 'groundname')}
            groundsCapacity={tryPropertyOrNA(rightTeam.groundsInfo, 'capacity')}
            groundsThumbnailSrc={tryPropertyOrElse(rightTeam.groundsInfo, 'thumbnail', '')}
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
  homeTeam, rightAligned, name, website, nickName, groundsName, groundsCapacity, groundsThumbnailSrc, currentLeague,
  abstract, chairman, manager, players, pastLeaguesWon
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
    <div>
      <h2 className="ui center aligned header">{groundsName} {groundsCapacity !== 'N/A' && `(${groundsCapacity} seats)`}</h2>
      <img
        className="ui centered circular large image"
        src={groundsThumbnailSrc}
        alt={`${name}'s club grounds'`}
      />
    </div>
    <div className="ui raised segment">
      <h3 className="ui header">Club Information</h3>
      <h3 className="ui sub header">
        Current League: <a>{currentLeague}</a>
      </h3>
      <br />
      <p>{abstract}</p>
    </div>
  </div>
);

export default TeamInformation;
