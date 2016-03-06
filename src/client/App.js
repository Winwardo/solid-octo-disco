import React, { Component } from 'react';
import { MostUsedWords } from './view/mostUsedWords';
import Header from './Header';

const exampleWords = [
	{ 'word': 'three', 'count': 3 },
	{ 'word': 'two', 'count': 2 },
	{ 'word': 'one', 'count': 1 },
	{ 'word': 'ten', 'count': 1 },
	{ 'word': 'one', 'count': 1 },
	{ 'word': 'one', 'count': 1 },
	{ 'word': 'one', 'count': 1 },
	{ 'word': 'one', 'count': 1 },
	{ 'word': 'seven', 'count': 1 },
	{ 'word': 'one', 'count': 1 },
	{ 'word': 'one', 'count': 1 },
	{ 'word': 'football', 'count': 1 },
	{ 'word': 'one', 'count': 1 },
	{ 'word': 'one', 'count': 1 },
];

const App = () => {
  return (
		<div>
			<Header />

			{/* <Search /> */}

			<div style={{ width: '400px', float: 'right' }}>
				<MostUsedWords words = {exampleWords}/>
			</div>

			{/* <Footer /> */}
		</div>
	);
};

export default App;
