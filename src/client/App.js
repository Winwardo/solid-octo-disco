import React, { Component } from 'react';
import Header from './Header';
import Search from './search/Search';
import Feed from './feed/Feed'
import MostUsedWords from './results/MostUsedWords';
import { groupedCountWords, mostFrequentWords, mostActiveUsers, exampleTweets } from './tweetAnalysis';

const App = () => {
  return (
		<div>
			<Header />

			<Search />

      <div className="ui grid">
        <div className="four wide column">
          <h3>Most frequent users</h3>
        </div>

        <div className="eight wide column">
          <Feed />
        </div>

        <div className="four wide column">
          <MostUsedWords wordInfoList={groupedCountWords(mostFrequentWords(exampleTweets.map((data) => data.tweet)))} search=''/>
        </div>
      </div>

			{/* <Footer /> */}
		</div>
	);
};

export default App;
