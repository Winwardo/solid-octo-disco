import React from 'react';

export const Statistic = ({value, label}) => (
  <div className="statistic">
    <div className="value">
      {value}
    </div>
    <div className="label">
      {label}
    </div>
  </div>
);