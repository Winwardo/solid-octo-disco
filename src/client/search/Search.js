import React, { Component } from 'react';
import CurrentQueryTerms from './CurrentQueryTerms';
import CategoryFilters from './categories/CategoryFilters';

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
  <CategoryFilters />
);

export default Search;
