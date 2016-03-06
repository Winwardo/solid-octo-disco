import React, { Component } from 'react';


const WordInfo = ({ word, count }) => (
		<tr>
			<td className='left aligned column'>{word}</td>
			<td className='right aligned column'>{count}</td>
			<td className='right aligned column'>
				<div className="ui checkbox">
					<input type="checkbox"  defaultChecked="true"/>
				</div>
			</td>
		</tr>
);

const Words = React.createClass({
  componentDidUpdate() {
    $('.ui.checkbox').checkbox();
  },

  render() {
    return (
    <table className="ui celled table">
			<tbody>
      {
        this.props.words
        .filter((word) => {
          return word.word.includes(this.props.search);
        })
        .slice(0, 5)
        .map((word) => {
          return (
            <WordInfo word={word.word} count={word.count}></WordInfo>
          );
        })
      }
      </tbody>
    </table>
		);
  },
});

const CoolSearchBar = ({parentComp}) => (
	<div>
		<div className="ui fluid right icon input">
			<input type="text" placeholder="Search..." onChange={(e) => { parentComp.setState({ 'search': e.target.value }); }}/>
			<i className="search icon"></i>
		</div>
	</div>
);

const MostUsedWords = React.createClass({
  getInitialState() {
    return { 'search': '' };
  },

  componentDidMount() {
    $('.ui.checkbox').checkbox();
  },

  changedSearch: function (e) {
    //this.setState({ 'search': e.target.value });
  },

  render() {
    var self = this;
    let search;

    return (
    <div>
      <h3>Most frequent words</h3>
      <div>
        <div className="ui two column grid">
          <div className="column">
            <CoolSearchBar parentComp={self}/>
          </div>
          <div className='right aligned column'>
            <button className="ui button">Hide all</button>
          </div>
        </div>
        <Words words={self.props.words} search={self.state.search}/>
      </div>
    </div>
    );
  },
});

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
