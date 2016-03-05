import React, { Component } from 'react';

const MostUsedWords = React.createClass({
		'getInitialState': function () {
			return {
				showAllWords: true,
				'words': [
					{ 'word': 'three', 'count': 3 },
					{ 'word': 'two', 'count': 2 },
					{ 'word': 'one', 'count': 1 },
				]
			};
		},
		'componentDidMount': () => {
			$(".ui.checkbox").checkbox();
		},
		'render': function () {
			var self = this;
			return (
				<div>
					<h3>Most frequent words</h3>
					<div>
						<div className="ui two column grid">
							<div className="column">
								<i className="search icon"></i>
							</div>
							<div className='right aligned column'>
								<label htmlFor="showAllWords">Show all words:</label>
								<div className="ui toggle checkbox">
									<input type="checkbox" id="showAllWords"/>
								</div>
							</div>
						</div>
						<div>
							<div className="ui three column grid">
								{
									self.state.words.map((word) => {
										return (
											<div className="row">
												<div className='left aligned column'>{word.word}</div>
												<div className='right aligned column'>{word.count}</div>
												<div className='right aligned column'>
													<div className="ui checkbox">
														<input type="checkbox" />
													</div>
												</div>
											</div>
										);
									})
								}
							</div>
						</div>
					</div>
				</div>
			);
		}
	});

const App = () => {
  return (
		<div>
			<h2 className="ui center aligned icon header">
				<i className="circular users icon"></i>
					Socto; Topher wins at life.
			</h2>
			<MostUsedWords></MostUsedWords>
		</div>
	);
};

export default App;
