import React, { Component } from 'react';

const MostUsedWords = React.createClass({
		'getInitialState': function () {
			return { showAllWords: true };
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
						<div>
							<div><i className="search icon"></i></div>
							<div>
								<label htmlFor="showAllWords">Show all words:</label>
								<div className="ui toggle checkbox">
									<input type="checkbox" id="showAllWords"/>
								</div>
							</div>
						</div>
						<div></div>
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
