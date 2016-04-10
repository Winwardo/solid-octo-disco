import React, { Component } from 'react';
import { connect } from 'react-redux';
import MostFrequent from './../MostFrequent';
import {
  updateMostUsedWordsSearch,
  toggleMostUsedWords, toggleAllMostUsedWordsSearch
} from './../mostFrequentActions';
import WordItemsList from './WordItemsList';

const MostUsedWords = ({
  dispatch, wordInfoList, isWordsToggledActionHide, filterTerm, postsLength,
}) => {
  const filteredItems = wordInfoList.filter(
    (wordInfo) => wordInfo.word.toLowerCase().includes(filterTerm.toLowerCase())
  ).slice(0, 100);

  return (
    <MostFrequent title="Top Words"
      icon="file text icon"
      count={filteredItems.length}
      filterTerm={filterTerm}
      onTypingInSearchBar={(newFilterTerm) => {
        dispatch(updateMostUsedWordsSearch(newFilterTerm));
      }}
      onToggleAll={() => {
        dispatch(toggleAllMostUsedWordsSearch());
      }}
      currentToggledAction={isWordsToggledActionHide}
    >
      <WordItemsList words={filteredItems} postsLength={postsLength}
        isWordsToggledActionHide={isWordsToggledActionHide}
        toggleMostUsedWords={(word) => {
          dispatch(toggleMostUsedWords(word));
        }}
      />
    </MostFrequent>
  );
};

export default connect()(MostUsedWords);
