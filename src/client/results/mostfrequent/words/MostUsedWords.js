import React, { Component } from 'react';
import { connect } from 'react-redux';
import MostFrequent from './../MostFrequent';
import { updateMostUsedwordsSearch, toggleMostUsedWord } from './../mostFrequentActions';
import WordItemsList from './WordItemsList';

const MostUsedWords = ({ dispatch, wordInfoList, filterTerm }) => {
  const filteredItems = wordInfoList.filter(
    (wordInfo) => wordInfo.word.toLowerCase().includes(filterTerm.toLowerCase())
  ).slice(0, 100);

  return (
    <MostFrequent title="Most Used Words"
      onTypingInSearchBar={(newFilterTerm) => {
        dispatch(updateMostUsedwordsSearch(newFilterTerm));
      }}
      filterTerm={filterTerm}
    >
      <WordItemsList words={filteredItems} toggleMostUsedWord={(word) => {
        dispatch(toggleMostUsedWord(word));
      }} />
    </MostFrequent>
  );
};

export default connect()(MostUsedWords);
