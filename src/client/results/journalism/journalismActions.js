export const SELECT_ENTITY_TAB = 'SELECT_ENTITY_TAB';
export const selectEntityTab = (newEntityTabIndex) => ({
  type: SELECT_ENTITY_TAB,
  newEntityTabIndex,
});

export const SELECT_TEAM_ENTITY_MATCH = 'SELECT_TEAM_ENTITY_MATCH';
export const selectTeamEntityMatch = (entityId, newMatchId) => ({
  type: SELECT_TEAM_ENTITY_MATCH,
  entityId,
  newMatchId,
});
