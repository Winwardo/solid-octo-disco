import { should } from 'chai';
import * as actions from './categoryFilterActions';

describe('#categoryFilterActions', () => {
  describe('footballSeasonActions', () => {
    it('should create an action to request football season', () => {
      const year = 2016;

      const expectedAction = {
        type: actions.REQUEST_FOOTBALL_SEASON,
        year,
      };

      actions.requestFootballSeason(year).should.deep.equal(expectedAction);
    });

    it('should create an action to receive football season', () => {
      const year = 2016;
      const exampleJson = { seasons: ['season1', 'season2'] };

      const expectedAction = {
        type: actions.RECEIVE_FOOTBALL_SEASON,
        year,
        footballSeasons: exampleJson,
      };

      actions.receiveFootballSeason(year, exampleJson).should.deep.equal(expectedAction);
    });

    it('should create an action to remove a football season', () => {
      const year = 2016;

      const expectedAction = {
        type: actions.REMOVE_FOOTBALL_SEASON,
        year,
      };

      actions.removeFootballSeason(year).should.deep.equal(expectedAction);
    });
  });

  describe('yearsFootballLeaguesTeams', () => {
    it('should create an action to request football league teams', () => {
      const year = 2016;

      const expectedAction = {
        type: actions.REQUEST_YEARS_FOOTBALL_LEAGUES_TEAMS,
        year,
      };

      actions.requestYearsFootballLeaguesTeams(year).should.deep.equal(expectedAction);
    });

    it('should create an action to receive football league teams', () => {
      const year = 2016;
      const exampleJson = { leagues: ['league1', 'league2'] };

      const expectedAction = {
        type: actions.RECEIVE_YEARS_FOOTBALL_LEAGUES_TEAMS,
        year,
        footballLeagues: exampleJson,
      };

      actions.receiveYearsFootballLeaguesTeams(year, exampleJson).should.deep.equal(expectedAction);
    });
  });

  describe('footballTeamPlayers', () => {
    it('should create an action to select and request football team players', () => {
      const id = 1;
      const name = 'example football team';
      const shortName = 'ExFootTeam';
      const crestUrl = 'http://exFootTeamCrest.com';

      const expectedAction = {
        type: actions.SELECT_AND_REQUEST_FOOTBALL_TEAM,
        id,
        name,
        shortName,
        crestUrl,
      };

      actions.selectAndRequestFootballTeam(id, name, shortName, crestUrl).should.deep.equal(expectedAction);
    });

    it('should create an action to select and request football team players', () => {
      const exampleJson = { players: ['player1', 'player2'] };

      const expectedAction = {
        type: actions.RECEIVE_SELECTED_FOOTBALL_TEAM_PLAYERS,
        footballTeamPlayers: exampleJson,
      };

      actions.receiveSelectedFootballTeamPlayers(exampleJson).should.deep.equal(expectedAction);
    });

    it('should create an action to remove selection of a football team players', () => {
      const expectedAction = {
        type: actions.REMOVE_SELECTED_FOOTBALL_TEAM_PLAYERS,
      };

      actions.removeSelectedFootballTeamPlayers().should.deep.equal(expectedAction);
    });
  });
});
