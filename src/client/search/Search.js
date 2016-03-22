import React, { Component } from 'react';
import CurrentQueryTerms from './CurrentQueryTerms';

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
