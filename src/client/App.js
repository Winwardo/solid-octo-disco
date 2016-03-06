import React, { Component } from 'react';
import { MostUsedWords } from './results/MostUsedWords';
import Header from './Header';
import { mostFrequentWords, mostActiveUsers, exampleTweets } from './tweetAnalysis';

const App = () => {
  return (
		<div>
			<Header />

			{/* <Search /> */}

			<div style={{ width: '400px', float: 'right' }}>
				<MostUsedWords wordInfoList={mostFrequentWords(exampleTweets.map((data) => data.tweet))} search=''/>
			</div>

			{/* <Footer /> */}
		</div>
	);
};

export default App;
