import React, { Component } from 'react';
import { connect } from 'react-redux';
import Feed from './feed/Feed';
import MostUsedWords from './results/MostUsedWords';
import { groupedCountWords, mostFrequentWords, mostActiveUsers, exampleTweets } from './tweetAnalysis';

let Results = ({ feed }) => (
  <div className="ui grid">
    <div className="four wide column">
      <h3>Most frequent users</h3>
    </div>

    <div className="eight wide column">
      <Feed />
    </div>

    <div className="four wide column">
      <MostUsedWords wordInfoList={groupedCountWords(mostFrequentWords(feed.map((post) => post.data)))} search=''/>
    </div>
  </div>
);

const mapStateToProps = (state) => ({ feed: state.feed });

Results = connect(mapStateToProps)(Results);
export default Results;
