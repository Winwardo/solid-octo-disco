import React, { Component } from 'react';

const WordInfo = ({ word, count }) => (
		<div className="row">
			<div className='left aligned column'>{word}</div>
			<div className='right aligned column'>{count}</div>
			<div className='right aligned column'>
				<div className="ui checkbox" onClickTodo='TODO: Send a redux event to hide tweets with this word'>
					<input type="checkbox" />
				</div>
			</div>
		</div>
)

const Words = ({words}) => (
	<div className="ui three column grid">
		{
			words.map((word) => {
				return (
					<WordInfo word={word.word} count={word.count}></WordInfo>
				);
			})
		}
	</div>
)

const MostUsedWords = React.createClass({
		getInitialState() {
			return {
				showAllWords: true,
				'words': [
					{ 'word': 'three', 'count': 3 },
					{ 'word': 'two', 'count': 2 },
					{ 'word': 'one', 'count': 1 },
				]
			};
		},
		componentDidMount() {
			$(".ui.checkbox").checkbox();
		},
		render() {
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
									<input type="checkbox"/>
								</div>
							</div>
						</div>
						<Words words={self.state.words}></Words>
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
