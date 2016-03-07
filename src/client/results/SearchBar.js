import React from 'react';

export const SlidingSearchBar = () => (
  <div className='ui fluid right icon input'>
    <input type='text' placeholder='Search...' onChange={(e) => { console.log(`store.dispatch(${e.target.value})`); }}/>
    <i className='search icon'></i>
  </div>
);
