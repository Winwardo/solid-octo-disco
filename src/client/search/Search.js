import React, { Component } from 'react';
import Current from './Current';

const Search = () => {
  return (
    <div className="ui left aligned container">
      <Current />
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
