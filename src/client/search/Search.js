import React, { Component } from 'react';
import CurrentQueryTerms from './CurrentQueryTerms';

const Search = () => {
  return (
    <div className="ui left aligned container">
      <CurrentQueryTerms />
      <Filters />
    </div>
  );
};

const Filters = () => {
  return (
    <div className="row">
      Filters will go here
    </div>
  );
};

export default Search;
