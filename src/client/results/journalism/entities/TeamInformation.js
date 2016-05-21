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

const MatchInformation = ({ leftTeam, rightTeam }) => (
  <div className="row">
    <div className="ui grid">
      <div className="eight wide column">
        <TeamDetails
          name={leftTeam.team}
          website={leftTeam.clubInfo.website.value}
          nickName={leftTeam.clubInfo.nickname.value}
          groundsName={leftTeam.groundsInfo.groundname.value}
          groundsCapacity={leftTeam.groundsInfo.capacity.value}
          groundsThumbnailSrc={leftTeam.groundsInfo.thumbnail.value}
          currentLeague={leftTeam.clubInfo.label.value}
          abstract={leftTeam.clubInfo.abstract.value}
          chairman={leftTeam.chairman}
          manager={leftTeam.manager}
          players={leftTeam.players}
          pastLeaguesWon={leftTeam.leaguesWon}
        />
      </div>
      <div className="eight wide column">
        <TeamDetails
          name={rightTeam.team}
          website={rightTeam.clubInfo.website.value}
          nickName={rightTeam.clubInfo.nickname.value}
          groundsName={rightTeam.groundsInfo.groundname.value}
          groundsCapacity={rightTeam.groundsInfo.capacity.value}
          groundsThumbnailSrc={rightTeam.groundsInfo.thumbnail.value}
          currentLeague={rightTeam.clubInfo.label.value}
          abstract={rightTeam.clubInfo.abstract.value}
          chairman={rightTeam.chairman}
          manager={rightTeam.manager}
          players={rightTeam.players}
          pastLeaguesWon={rightTeam.leaguesWon}
        />
      </div>
    </div>
  </div>
);

const TeamDetails = ({
  name, website, nickName, groundsName, groundsCapacity, groundsThumbnailSrc, currentLeague,
  abstract, chairman, manager, players, pastLeaguesWon
}) => (
  <div>
    <a className="ui massive purple ribbon label" href={website} target="_blank">{name}</a>
    <h2 className="ui header">A.K.A {nickName}</h2>
    <div>
      <h2 className="ui center aligned header">{groundsName} ({groundsCapacity} seats)</h2>
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
