import React, { Component } from 'react';

export const TwitterProfilePicture = ({ author, size }) => (
  <img className={`ui left floated bordered ${size} rounded image`}
       src={author.profile_image_url.replace('_normal', '')}
       alt={`${author.name}'s Twitter profile picture`}
       style={{ maxHeight: '80px', maxWidth: '80px' }}
  />
);
