import React, { Component } from 'react';
import { connect } from 'react-redux';
import MostFrequent from './MostFrequent';
import WordItemsList from './WordItemsList';
import { updateMostUsedwordsSearch } from './resultsActions';

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
      <WordItemsList words={filteredItems} />
    </MostFrequent>
  );
};

export default connect()(MostUsedWords);
