import React from 'react';
import EntityMenu from './EntityMenu';
import { PLAYER_ENTITY, TEAM_ENTITY } from '../../search/searchActions';
import PlayerInformation from './entities/PlayerInformation';
import TeamInformation from './entities/TeamInformation';

const JournalismInformation = ({
  journalismInfo, onClickSelectEntityTab, onClickSelectTeamMatch
}) => (
  <div style={{ width: '100%' }}>
    <div className="row" style={{ margin: '0px 25px' }}>
      <EntityMenu
        selectedEntity={journalismInfo.entityCurrentlySelected}
        entities={Object.keys(journalismInfo.entities).map(entityId => ({
          id: entityId,
          name: journalismInfo.entities[entityId].query,
          fetching: journalismInfo.entities[entityId].fetching,
          crestUrl: journalismInfo.entities[entityId].details.crestUrl,
        }))}
        onClickSelectEntityTab={onClickSelectEntityTab}
      />
      <div>
        {
          Object.keys(journalismInfo.entities).map(entityId => {
            const entityInfo = journalismInfo.entities[entityId];
            switch (entityInfo.entityType) {
              case PLAYER_ENTITY:
              return (
                <div
                  key={`playerEntity${entityId}`}
                  className={`ui tab ${journalismInfo.entityCurrentlySelected === parseInt(entityId, 10) && 'active'}`}
                >
                  {
                    entityInfo.fetching ?
                      <div className="ui active dimmer">
                        <div className="ui medium text loader">Loading</div>
                      </div>
                    :
                      <PlayerInformation playerInfo={entityInfo}/>
                  }
                </div>
              );
              case TEAM_ENTITY:
              return (
              <div
                key={`teamEntity${entityId}`}
                className={`ui tab ${journalismInfo.entityCurrentlySelected === parseInt(entityId, 10) && 'active'}`}
              >
                {
                  entityInfo.fetching ?
                    <div className="ui active dimmer">
                      <div className="ui medium text loader">Loading</div>
                    </div>
                  :
                    <TeamInformation
                      matches={entityInfo.entity.matches}
                      selectedMatchId={entityInfo.entity.selectedMatch}
                      onSelectMatch={(matchId) => onClickSelectTeamMatch(entityId, matchId)}
                    />
                }
              </div>
              );
              default:
              return `Sorry there is no ${entityInfo.entityType} type that can be shown`;
            }
          })
        }
      </div>
    </div>
  </div>
);

export default JournalismInformation;
