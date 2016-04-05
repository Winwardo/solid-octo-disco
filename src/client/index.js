import 'babel-polyfill';
import ReactDOM from 'react-dom';
import React from 'react';
import { combineReducers, compose, applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import { searchTermsReducer, feedReducer } from './search/searchReducer';
import mostFrequentReducer from './results/mostfrequent/mostFrequentReducer';
import footballCategoryFiltersReducer from './search/categories/categoryFiltersReducer';
import { newPromiseChain } from './../shared/utilities';
import {
  fetchAllFootballSeasons, fetchAllFootballLeagueTeams
} from './search/categories/categoryFilterActions';
import moment from 'moment';

const feedApp = combineReducers({
  searchTerms: searchTermsReducer,
  mostFrequent: mostFrequentReducer,
  feed: feedReducer,
  football: footballCategoryFiltersReducer,
});

const middlewares = [thunkMiddleware];

const finalStore = createStore(
  feedApp,
  compose(
    applyMiddleware(...middlewares),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

// fetch all the football seasons on startup
finalStore.dispatch(fetchAllFootballSeasons(moment().year() - 1, true));

const rootElement = document.getElementById('root');

let render = () => {
  const App = require('./queryInterface').default;
  ReactDOM.render(
    <Provider store={finalStore}>
      <App />
    </Provider>,
    rootElement
  );
};

if (module.hot) {
  // Support hot reloading of components
  const renderApp = render;

  // and display an overlay for runtime errors
  const renderError = (error) => {
    const RedBox = require('redbox-react');
    ReactDOM.render(
      <RedBox error={error} />,
      rootElement
    );
  };

  render = () => {
    try {
      renderApp();
    } catch (error) {
      renderError(error);
    }
  };

  module.hot.accept('./queryInterface', () => {
    setTimeout(render);
  });
}

render();
