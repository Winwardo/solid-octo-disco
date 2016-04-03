import React, { Component } from 'react';
import CurrentQueryTerms from './CurrentQueryTerms';
import CategoryFilters from './categories/CategoryFilters';

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
