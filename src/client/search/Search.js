import React, { Component } from 'react';
import CurrentQueryTerms from './CurrentQueryTerms';

/**
 * Search encompasses the entire search interface, including the "Filters"
 * that allow a user to easily select pre-populated football team data.
 * Again, follow CurrentQueryTerms to './CurrentQueryTerms.js' for a deeper
 * breakdown of the interface.
 */
const Search = () => (
  <div className="ui left aligned container">
    <CurrentQueryTerms />
    <Filters />
  </div>
);

const Filters = () => (
  <div className="row">
    Filters will go here
  </div>
);

export default Search;
