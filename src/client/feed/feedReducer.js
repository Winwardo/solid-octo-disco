import { UPDATE_FEED_RESULTS } from '../search/SearchActions';

const feed = (state = { 'posts': [] }, action) => {
  switch (action.type) {
    case UPDATE_FEED_RESULTS:
      return { 'posts': action.data };
    default:
      return state;
  };
};

export default feed;
