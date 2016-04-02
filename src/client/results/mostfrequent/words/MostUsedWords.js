import React, { Component } from 'react';
import { connect } from 'react-redux';
import MostFrequent from './../MostFrequent';
import {
  updateMostUsedWordsSearch,
  toggleMostUsedWord, toggleAllMostUsedWordsSearch
} from './../mostFrequentActions';
import WordItemsList from './WordItemsList';

const MostUsedWords = ({ dispatch, wordInfoList, wordsToggledAction, filterTerm }) => {
  const filteredItems = wordInfoList.filter(
    (wordInfo) => wordInfo.word.toLowerCase().includes(filterTerm.toLowerCase())
  ).slice(0, 100);

  return (
    <MostFrequent title="Most Used Words"
      filterTerm={filterTerm}
      onTypingInSearchBar={(newFilterTerm) => {
        dispatch(updateMostUsedWordsSearch(newFilterTerm));
      }}
      onToggleAll={() => {
        dispatch(toggleAllMostUsedWordsSearch());
      }}
      currentToggledAction={wordsToggledAction}
    >
      <WordItemsList words={filteredItems} wordsToggledAction={wordsToggledAction}
        toggleMostUsedWord={(word) => {
          dispatch(toggleMostUsedWord(word));
        }}
      />
    </MostFrequent>
  );
};

export default connect()(MostUsedWords);
