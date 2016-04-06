import { should } from 'chai';
import deepFreeze from 'deep-freeze';
import footballCategoryFiltersReducer from './categoryFiltersReducer';
import * as actions from './categoryFilterActions';

// copied from ./footballCategoryFiltersReducer
const footballCategoryFiltersInitialState = {
  seasonsByYear: {},
  leagueTeamsByYear: {},
  selectedTeam: {
    isSelected: false,
    isFetching: false,
  },
};

describe('#footballCategoryFiltersReducer', () => {
  const year = 2016;
  describe('footballSeason', () => {
    it('should start fetching the requested seasons data', () => {
      const stateBefore = footballCategoryFiltersInitialState;
      const action = actions.requestFootballSeason(year);

      const stateAfter = {
        seasonsByYear: {
          [year]: {
            isFetching: true,
            seasons: [],
          },
        },
        leagueTeamsByYear: {},
        selectedTeam: {
          isSelected: false,
          isFetching: false,
        },
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      footballCategoryFiltersReducer(stateBefore, action).should.deep.equal(stateAfter);
    });

    it('should finish fetching the requested seasons data', () => {
      const exampleJson = { seasons: ['season1', 'season2'] };
      const stateBefore = footballCategoryFiltersReducer(
        footballCategoryFiltersInitialState,
        actions.requestFootballSeason(year)
      );
      const action = actions.recieveFootballSeason(year, exampleJson);

      const stateAfter = {
        seasonsByYear: {
          [year]: {
            isFetching: false,
            seasons: exampleJson,
          },
        },
        leagueTeamsByYear: {},
        selectedTeam: {
          isSelected: false,
          isFetching: false,
        },
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      footballCategoryFiltersReducer(stateBefore, action).should.deep.equal(stateAfter);
    });
  });

  describe('years football leagues teams', () => {
    it('should start fetching the requested years football league teams data', () => {
      const stateBefore = footballCategoryFiltersInitialState;
      const action = actions.requestYearsFootballLeaguesTeams(year);

      const stateAfter = {
        seasonsByYear: {},
        leagueTeamsByYear: {
          [year]: {
            isFetching: true,
            leagues: [],
          },
        },
        selectedTeam: {
          isSelected: false,
          isFetching: false,
        },
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      footballCategoryFiltersReducer(stateBefore, action).should.deep.equal(stateAfter);
    });

    it('should finish fetching the requested years football league teams data', () => {
      const exampleJson = { leagues: ['league1', 'league2'] };
      const stateBefore = footballCategoryFiltersReducer(
        footballCategoryFiltersInitialState,
        actions.requestYearsFootballLeaguesTeams(year)
      );
      const action = actions.recieveYearsFootballLeaguesTeams(year, exampleJson);

      const stateAfter = {
        seasonsByYear: {},
        leagueTeamsByYear: {
          [year]: {
            isFetching: false,
            leagues: exampleJson,
          },
        },
        selectedTeam: {
          isSelected: false,
          isFetching: false,
        },
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      footballCategoryFiltersReducer(stateBefore, action).should.deep.equal(stateAfter);
    });
  });

  describe('football team players', () => {
    const id = 1;
    const name = 'example football team';
    const shortName = 'ExFootTeam';
    const crestUrl = 'http://exFootTeamCrest.com';
    it('should select and start fetching the requested football team players', () => {
      const stateBefore = footballCategoryFiltersInitialState;
      const action = actions.selectAndRequestFootballTeam(id, name, shortName, crestUrl);

      const stateAfter = {
        seasonsByYear: {},
        leagueTeamsByYear: {},
        selectedTeam: {
          isSelected: true,
          isFetching: true,
          id,
          name,
          shortName,
          crestUrl,
          players: [],
        },
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      footballCategoryFiltersReducer(stateBefore, action).should.deep.equal(stateAfter);
    });

    it('should finish fetching the requested football team players', () => {
      const exampleJson = { players: ['player1', 'player2'] };
      const stateBefore = footballCategoryFiltersReducer(
        footballCategoryFiltersInitialState,
        actions.selectAndRequestFootballTeam(id, name, shortName, crestUrl)
      );
      const action = actions.recieveSelectedFootballTeamPlayers(exampleJson);

      const stateAfter = {
        seasonsByYear: {},
        leagueTeamsByYear: {},
        selectedTeam: {
          isSelected: true,
          isFetching: false,
          id,
          name,
          shortName,
          crestUrl,
          ...exampleJson,
        },
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      footballCategoryFiltersReducer(stateBefore, action).should.deep.equal(stateAfter);
    });

    it('should remove the selected football team players', () => {
      const exampleJson = { players: ['player1', 'player2'] };
      const stateBefore = footballCategoryFiltersReducer(
        footballCategoryFiltersInitialState,
        actions.recieveSelectedFootballTeamPlayers(exampleJson),
      );
      const action = actions.removeSelectedFootballTeamPlayers();

      const stateAfter = footballCategoryFiltersInitialState;

      deepFreeze(stateBefore);
      deepFreeze(action);

      footballCategoryFiltersReducer(stateBefore, action).should.deep.equal(stateAfter);
    });
  });
});
