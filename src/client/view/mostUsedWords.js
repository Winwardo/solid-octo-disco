import React from 'react';
import { SlidingSearchBar } from './searchBar';

const WordInfo = ({ wordInfo }) => (
  <tr>
    <td className='right aligned column'>{wordInfo.count}</td>
    <td className='left aligned column'>{wordInfo.word}</td>
    <td className='right aligned column'>
      <div className="ui checkbox">
        <input type="checkbox"  defaultChecked="true"/>
      </div>
    </td>
  </tr>
);

const Words = React.createClass({
  componentDidMount() {
    $('.ui.checkbox').checkbox();
  },

  componentDidUpdate() {
    $('.ui.checkbox').checkbox();
  },

  render() {
    return (
      <div style={{ 'height': '300px', 'overflow-y': 'scroll' }}>
        <table className="ui very basic celled table">
          <tbody>
          { this.props.words.map((wordInfo) => <WordInfo wordInfo={wordInfo}></WordInfo>) }
          </tbody>
        </table>
      </div>
    );
  },
});

const ToggleAllWords = () => (
  <button className="ui button">Hide all</button>
);

export const MostUsedWords = React.createClass({
  getInitialState() {
    return { 'search': '' };
  },

  filterWords() {
    return this.props.words
      .filter((word) => {
        return word.word.includes(this.state.search);
      })
      .slice(0, 100);
  },

  render() {
    return (
      <div>
        <h3>Most frequent words</h3>
        <div>
          <div className="ui two column grid">
            <div className="column">
              <SlidingSearchBar parentComp={self}/>
            </div>
            <div className='right aligned column'>
              <ToggleAllWords />
            </div>
          </div>
          <br/>
          <Words words={this.filterWords()}/>
        </div>
      </div>
    );
  },
});
