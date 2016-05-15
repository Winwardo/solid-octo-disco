import React from 'react';
import { throttleFunction } from '../../../../shared/utilities';

const SlidingSearchBar = ({ onTypingInSearchBar, currentValue }) => {
  const delayedOnTypingInSearchBar = throttleFunction(onTypingInSearchBar, 250);

  return (
    <div className="ui fluid right icon input">
      <input
        type="text"
        placeholder="Search..."
        defaultValue={currentValue}
        onChange={
          (e) => { delayedOnTypingInSearchBar('' + e.target.value); }
         }
      />
      <i className="search icon"></i>
    </div>
  );
};

export default SlidingSearchBar;
