import React, { Component } from 'react';
import { connect } from 'react-redux';
import MostFrequent from './../MostFrequent';
import { updateActiveUsersSearch } from './../mostFrequentActions';
import UserItemsList from './UserItemsList';

const MostActiveUsers = ({ dispatch, userInfoList, filterTerm }) => {
  const filteredItems = userInfoList.filter(
    (userInfo) => {
      const matchUserName = userInfo.author.name.toLowerCase().includes(filterTerm.toLowerCase());
      const matchUserHandle = userInfo.author.handle.toLowerCase().includes(filterTerm.toLowerCase());

      return matchUserName || matchUserHandle;
    }
  ).slice(0, 100);

  return (
    <MostFrequent title="Most Active Users"
      onTypingInSearchBar={(newFilterTerm) => {
        dispatch(updateActiveUsersSearch(newFilterTerm));
      }}
      filterTerm={filterTerm}
    >
      <UserItemsList users={filteredItems} />
    </MostFrequent>
  );
};

export default connect()(MostActiveUsers);
