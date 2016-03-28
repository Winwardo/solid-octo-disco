import React, { Component } from 'react';
import { connect } from 'react-redux';
import Feed from './Feed';
import MostUsedWords from './MostUsedWords';
import { groupedCountWords, mostFrequentWords, mostActiveUsers } from './../tweetAnalysis';

let Results = ({ feed, mostUsedWords }) => {
  if (feed.length === 0) {
    return (
      <div className="ui violet inverted center aligned segment">
        <h2 className="ui inverted header">
          <div className="sub header">
            Start using Socto by typing into the search bar or by using the filters.
          </div>
        </h2>
      </div>
    );
  }

  return (
    <div className="ui grid">
      <div className="four wide column">
        <h3>Most frequent users</h3>
      </div>

      <div className="eight wide column">
        <Feed feed={feed} hiddenWords={mostUsedWords.wordsToHide} />
      </div>

      <div className="four wide column">
        <MostUsedWords filterTerm={mostUsedWords.filterTerm}
          wordInfoList={groupedCountWords(mostFrequentWords(feed.map((post) => post.data)))}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  feed: state.feed,
  mostUsedWords: state.mostUsedWords,
});

Results = connect(mapStateToProps)(Results);
export default Results;
