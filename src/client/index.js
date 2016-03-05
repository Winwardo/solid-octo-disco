import 'babel-polyfill';
import ReactDOM from 'react-dom';
import React from 'react';

const rootEl = document.getElementById('root');

let render = () => {
  const App = require('./App').default;
  ReactDOM.render(<App />, rootEl);
};

if (module.hot) {
  // Support hot reloading of components
  // and display an overlay for runtime errors
  const renderApp = render;
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
