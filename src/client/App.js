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

			<Feed />

			<div style={{ width: '400px', float: 'right' }}>
				<MostUsedWords wordInfoList={groupedCountWords(mostFrequentWords(exampleTweets.map((data) => data.tweet)))} search=''/>
			</div>

			{/* <Footer /> */}
		</div>
	);
};

export default App;
