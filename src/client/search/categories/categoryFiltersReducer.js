import {
  REQUEST_FOOTBALL_SEASON, RECIEVE_FOOTBALL_SEASON, REMOVE_FOOTBALL_SEASON,
  REQUEST_YEARS_FOOTBALL_LEAGUES_TEAMS, RECIEVE_YEARS_FOOTBALL_LEAGUES_TEAMS
} from './categoryFilterActions';

const footballCategoryFiltersReducer = (state = { seasonsByYear: {}, leagueTeamsByYear: {} }, action) => {
  switch (action.type) {
  case REQUEST_FOOTBALL_SEASON:
  case RECIEVE_FOOTBALL_SEASON:
    return {
      ...state,
      seasonsByYear: {
        ...state.seasonsByYear,
        [action.year]: footballSeasonReducer(state.seasonsByYear[action.year], action),
      },
    };
  case REMOVE_FOOTBALL_SEASON: {
    const oldSeasonsByYear = state.seasonsByYear;
    delete oldSeasonsByYear[action.year];
    return {
      ...state,
      seasonsByYear: oldSeasonsByYear,
    };
  }
  case REQUEST_YEARS_FOOTBALL_LEAGUES_TEAMS:
  case RECIEVE_YEARS_FOOTBALL_LEAGUES_TEAMS:
    return {
      ...state,
      leagueTeamsByYear: {
        ...state.leagueTeamsByYear,
        [action.year]: footballLeagueTeamsReducer(state.leagueTeamsByYear[action.year], action)
      },
    };
  default:
    return state;
  }
};

const footballSeasonReducer = (state = { isFetching: false, seasons: [] }, action) => {
  switch (action.type) {
  case REQUEST_FOOTBALL_SEASON:
    return {
      ...state,
      isFetching: true,
    };
  case RECIEVE_FOOTBALL_SEASON:
    return {
      isFetching: false,
      seasons: action.footballSeasons,
    };
  default:
    return state;
  }
};

const footballLeagueTeamsReducer = (state = { isFetching: false, leagues: [] }, action) => {
  switch (action.type) {
  case REQUEST_YEARS_FOOTBALL_LEAGUES_TEAMS:
    return {
      ...state,
      isFetching: true,
    };
  case RECIEVE_YEARS_FOOTBALL_LEAGUES_TEAMS:
    return {
      isFetching: false,
      leagues: action.footballLeagues,
    };
  default:
    return state;
  }
};


export default footballCategoryFiltersReducer;
