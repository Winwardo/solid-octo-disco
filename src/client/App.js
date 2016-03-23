import React, { Component } from 'react';
import Header from './Header';
import Search from './search/Search';
import Results from './Results.js';

const App = ({ feed }) => (
  <div>
    <Header />

    <Search />

    <Results />

    {/* <Footer /> *//* <Footer /> */}
  </div>
);

export default App;
