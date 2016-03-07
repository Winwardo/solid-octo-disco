import 'babel-polyfill';
import ReactDOM from 'react-dom';
import React from 'react';
import {combineReducers, compose, applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import searchTerms from './search/SearchTermsReducer';

const feedApp = combineReducers({
  searchTerms,
});

const middlewares = [];

const finalStore = createStore(
  feedApp,
  compose(
    applyMiddleware(...middlewares),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

const rootEl = document.getElementById('root');

let render = () => {
  const App = require('./App').default;
  ReactDOM.render(
    <Provider store={finalStore}>
      <App />
    </Provider>,
    rootEl
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
      rootEl
    );
  };

  render = () => {
    try {
      renderApp();
    } catch (error) {
      renderError(error);
    }
  };

  module.hot.accept('./App', () => {
    setTimeout(render);
  });
};

render();
