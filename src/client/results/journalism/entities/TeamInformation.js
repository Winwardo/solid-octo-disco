import React from 'react';
import moment from 'moment';

const TeamInformation = ({ matches }) => (
  <div>
    <div className="row">
      <div className="ui grid">
        <div className="four wide column">
          <MatchList matches={matches} />
        </div>
        <div className="twelve wide column">
          <MatchInformation leftTeam={`left team`} rightTeam={`right team`}/>
        </div>
      </div>
    </div>
  </div>
);

const MatchList = ({ matches }) => (
  <div className="ui raised purple segment" style={{ margin: '0px 10px' }}>
    <h1 className="ui center aligned purple header">Matches</h1>
    {matches.map(match => (
      <div className="ui left labeled fluid button">
        <div className="ui basic right pointing label">
          {moment(match.fixtureInfo.date).format('DD/MM/YY')}
        </div>
        <div className="ui left aligned fluid button">
          {`${match.leftTeam.team} vs ${match.rightTeam.team}`}
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
