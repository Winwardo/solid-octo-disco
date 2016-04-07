import React, { Component } from 'react';
import { connect } from 'react-redux';
import MostFrequent from './../MostFrequent';
import { updateActiveUsersSearch, toggleAllMostActiveUsersSearch } from './../mostFrequentActions';
import UserItemsList from './UserItemsList';

const MostActiveUsers = ({ dispatch, userInfoList, isUsersToggledActionHide, filterTerm, postsLength }) => {
  const filteredItems = userInfoList.filter(
    (userInfo) => {
      const matchUserName = userInfo.author.name.toLowerCase().includes(filterTerm.toLowerCase());
      const matchUserHandle = userInfo.author.handle.toLowerCase().includes(filterTerm.toLowerCase());

      return matchUserName || matchUserHandle;
    }
  ).slice(0, 100);

  return (
    <MostFrequent title={`${filteredItems.length} Most Active Users`}
      filterTerm={filterTerm}
      onTypingInSearchBar={(newFilterTerm) => {
        dispatch(updateActiveUsersSearch(newFilterTerm));
      }}
      onToggleAll={() => {
        dispatch(toggleAllMostActiveUsersSearch());
      }}
      currentToggledAction={isUsersToggledActionHide}
    >
      <UserItemsList users={filteredItems} postsLength={postsLength}
        isUsersToggledActionHide={isUsersToggledActionHide}
      />
    </MostFrequent>
  );
};

export default connect()(MostActiveUsers);
