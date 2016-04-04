import { REQUEST_FOOTBALL_SEASONS, RECIEVE_FOOTBALL_SEASONS } from './categoryFilterActions';

const footballSeasons = (state = { isFetching: false, seasons: [] }, action) => {
  switch (action.type) {
  case REQUEST_FOOTBALL_SEASONS:
    return {
      ...state,
      isFetching: true,
    };
  case RECIEVE_FOOTBALL_SEASONS:
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
  case REQUEST_FOOTBALL_SEASONS:
  case RECIEVE_FOOTBALL_SEASONS:
    return {
      ...state,
      seasonsByYear: {
        ...state.seasonsByYear,
        [action.year]: footballSeasons(state.seasonsByYear[action.year], action),
      },
    };
  default:
    return state;
  }
};

export default footballCategoryFiltersReducer;
