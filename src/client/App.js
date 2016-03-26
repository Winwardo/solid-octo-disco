import React, { Component } from 'react';
import Header from './Header';
import Search from './search/Search';
import Results from './results/Results.js';

const App = () => (
  <div>
    <Header />

    <Search />

    <Results />

    {/* <Footer /> *//* <Footer /> */}
  </div>
);

export default App;
