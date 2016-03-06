import React, { Component } from 'react';
import { MostUsedWords } from './view/mostUsedWords';

const App = () => {
  return (
		<div>
			<h2 className="ui center aligned icon header">
				<i className="circular users icon"></i>
					Socto; Topher wins at life.
			</h2>
			<div style={{ width: '400px', float: 'right' }}>
			<MostUsedWords words = {[
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
				]}/>
				</div>
		</div>
	);
};

export default App;
