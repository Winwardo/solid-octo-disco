import React from 'react';
import moment from 'moment';

const TeamInformation = ({ matches, selectedMatchId, onSelectMatch }) => (
  <div>
    <div className="row">
      <div className="ui grid">
        <div className="four wide column">
          <MatchList matches={matches} selectedMatchId={selectedMatchId} onSelectMatch={onSelectMatch} />
        </div>
        <div className="twelve wide column">
          <MatchInformation leftTeam={`left team`} rightTeam={`right team`}/>
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
  <div className="ui raised purple segment">
    <div className="ui grid">
      <div className="eight wide column">
        {leftTeam}
      </div>
      <div className="eight wide column">
        {rightTeam}
      </div>
    </div>
  </div>
);

export default TeamInformation;
