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

const Words = ({words, showAllWords}) => (
	<div>
		<div>
			{showAllWords}
		</div>
		<div className="ui three column grid">
			{
				words.map((word) => {
					return (
						<WordInfo word={word.word} count={word.count}></WordInfo>
					);
				})
			}
		</div>
	</div>
)

const CoolSearchBar = ({}) => (
	<div>
		<i className="search icon"></i>
		<div className="ui input">
			<input type="text" placeholder="Search..." />
		</div>
	</div>
)

const MostUsedWords = React.createClass({
		componentDidMount() {
			$(".ui.checkbox").checkbox();
		},
		render() {
			var self = this;
			let showAll;
			return (
				<div>
					<h3>Most frequent words</h3>
					<div>
						<div className="ui two column grid">
							<div className="column">
								<CoolSearchBar />
							</div>
							<div className='right aligned column'>
								<label htmlFor="showAllWords">Show all words: </label>
								<div className="ui toggle checkbox">
									<input type="checkbox"/>
								</div>
							</div>
						</div>
						<Words words={self.props.words} showAllWords={showAll} />
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
			<div style={{width: '400px', float: 'right'}}>
			<MostUsedWords words = {[
					{ 'word': 'three', 'count': 3 },
					{ 'word': 'two', 'count': 2 },
					{ 'word': 'one', 'count': 1 },
				]}/>
				</div>
		</div>
	);
};

export default App;
