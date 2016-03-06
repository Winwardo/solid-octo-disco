import React, { Component } from 'react';
import { MostUsedWords } from './view/mostUsedWords';
import Header from './Header';
import { mostFrequentWords, mostActiveUsers, exampleTweets } from './tweetAnalysis';

const App = () => {
  return (
		<div>
			<Header />

			{/* <Search /> */}

			<div style={{ width: '400px', float: 'right' }}>
				<MostUsedWords words = {mostFrequentWords(exampleTweets.map((data) => data.tweet))} />
			</div>

			{/* <Footer /> */}
		</div>
	);
};

export default App;
