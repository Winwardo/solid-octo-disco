import {
  REQUEST_FOOTBALL_SEASON, RECIEVE_FOOTBALL_SEASON, REMOVE_FOOTBALL_SEASON
} from './categoryFilterActions';

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

const footballCategoryFiltersReducer = (state = { seasonsByYear: {} }, action) => {
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
  default:
    return state;
  }
};

export default footballCategoryFiltersReducer;
