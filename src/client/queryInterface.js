import React, { Component } from 'react';
import Header from './Header';
import Search from './search/Search';
import Results from './results/Results.js';

/**
 * App is the core React component that describes our application interface.
 * Note how it is incredibly simple; it contains references to a {@link Header},
 * {@link Search}, {@link Results} and {@link Footer} component.
 * To see what is in the Search component (which is the most important),
 * follow the import reference seen above on line 3, and open the file
 * './search/Search.js'.
 */
const App = () => (
  <div>

    <Header />

    <Search />

    <Results />

    {/* <Footer /> *//* <Footer /> */}
  </div>
);

export default App;
