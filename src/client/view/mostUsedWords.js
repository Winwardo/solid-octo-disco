import React, { Component } from 'react';
import { SlidingSearchBar } from './searchBar';

const WordInfo = ({ wordInfo }) => (
  <tr>
    <td className='right aligned column'>{wordInfo.count}</td>
    <td className='left aligned column'>{wordInfo.word}</td>
    <td className='right aligned column'>
      <div className='ui checkbox'>
        <input type='checkbox'  defaultChecked='true'/>
      </div>
    </td>
  </tr>
);

class WordInfoList extends Component {
  componentDidMount() {
    $('.ui.checkbox').checkbox();
  }

  componentDidUpdate() {
    $('.ui.checkbox').checkbox();
  }

  render() {
    return (
      <div style={{ 'height': '300px', 'overflow-y': 'scroll' }}>
        <table className='ui very basic celled table'>
          <tbody>
          { this.props.words.map((wordInfo) => <WordInfo wordInfo={wordInfo}></WordInfo>) }
          </tbody>
        </table>
      </div>
    );
  }
};

const ToggleAllWords = () => (
  <button className='ui button'>Hide all</button>
);

export const MostUsedWords = ({ wordInfoList, search }) => {
  const filteredWords = () => {
    return wordInfoList
      .filter((wordInfo) => wordInfo.word.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 100);
  };

  return (
    <div>
      <h3>Most frequent words</h3>
      <div>
        <div className='ui two column grid'>
          <div className='column'>
            <SlidingSearchBar />
          </div>
          <div className='right aligned column'>
            <ToggleAllWords />
          </div>
        </div>
        <br/>
        <WordInfoList words={filteredWords()}/>
      </div>
    </div>
  );
};
