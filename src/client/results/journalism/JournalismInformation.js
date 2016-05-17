import React from 'react';
import EntityMenu from './EntityMenu';
import { PLAYER_ENTITY, TEAM_ENTITY } from '../../search/searchActions';
import PlayerInformation from './entities/PlayerInformation';
import TeamInformation from './entities/TeamInformation';

const JournalismInformation = ({ journalismInfo, onClickSelectEntityTab }) => (
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
            if (entityInfo.fetching) {
              return (
                <div className="ui active dimmer">
                  <div className="ui medium text loader">Loading</div>
                </div>
              );
            }

            switch (entityInfo.entityType) {
              case PLAYER_ENTITY:
              return (
              <div className={`ui tab ${journalismInfo.entityCurrentlySelected === parseInt(entityId, 10) && 'active'}`}>
                <PlayerInformation />
              </div>
              );
              case TEAM_ENTITY:
              return (
              <div className={`ui tab ${journalismInfo.entityCurrentlySelected === parseInt(entityId, 10) && 'active'}`}>
                <TeamInformation
                  matches={entityInfo.entity.matches}
                />
              </div>
              );
              default:
              return `Sorry there is no ${entity.entityType} type that can be shown`;
            }
          })
        }
      </div>
    </div>
  </div>
);

export default JournalismInformation;
