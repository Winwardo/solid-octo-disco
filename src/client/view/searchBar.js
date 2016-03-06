import React from 'react';

export const SlidingSearchBar = ({ parentComp }) => (
  <div>
    <div className="ui fluid right icon input">
      <input type="text" placeholder="Search..." onChange={(e) => { parentComp.setState({ 'search': e.target.value }); }}/>
      <i className="search icon"></i>
    </div>
  </div>
);
