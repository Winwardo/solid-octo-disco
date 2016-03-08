import React, { Component } from 'react';
import { connect } from 'react-redux';
import SlidingSearchBar from './SearchBar';

let MostUsedWords = ({ wordInfoList, search, mostUsedWords }) => {
  const filteredWords = () => {
    return wordInfoList
      .filter((wordInfo) => wordInfo.word.toLowerCase().includes(mostUsedWords.filterTerm.toLowerCase()))
      .slice(0, 100);
  };

  return (
    <div>
      <h3>Most frequent words</h3>
      <div>
        <div className='ui two column grid'>
          <div className='column'>
            <SlidingSearchBar searchFor='MOST_USED_WORDS_FILTER' />
          </div>
          <div className='right aligned column'>
            <ToggleAllWords />
          </div>
        </div>
        <br/>
        <WordItemList words={filteredWords()}/>
      </div>
    </div>
  );
};

class WordItemList extends Component {
  componentDidMount() {
    $('.ui.checkbox').checkbox();
    $('.ui.haspopup').popup();
  }

  componentDidUpdate() {
    $('.ui.checkbox').checkbox();
    $('.ui.haspopup').popup();
  }

  render() {
    return (
      <div style={{ height: '300px', overflowY: 'scroll' }}>
        <table className='ui very basic celled table'>
          <tbody>
          { this.props.words.map((wordInfo, id) => <WordItem key={id} wordInfo={wordInfo} />) }
          </tbody>
        </table>
      </div>
    );
  }
};

const WordItem = ({ wordInfo }) => (
  <tr>
    <td className='right aligned column'>{wordInfo.count}</td>
    <td className='left aligned column'>
      <div className='ui haspopup'>{wordInfo.word}</div>
      <div className='ui popup'>
        <table className='ui very basic celled table'>
          <tbody>
            {
              wordInfo.makeup.map((makeupInfo) => (
                  <tr>
                    <td className='right aligned column'>{Math.round(makeupInfo.count / wordInfo.count * 100)}%</td>
                    <td>{makeupInfo.word}</td>
                  </tr>
                )
              )
            }
          </tbody>
        </table>
      </div>
    </td>
    <td className='right aligned column'>
      <div className='ui checkbox'>
        <input type='checkbox' defaultChecked='true'/>
      </div>
    </td>
  </tr>
);

const ToggleAllWords = () => (
  <button className='ui button'>Hide all</button>
);

const mapStateToProps = (state) => {
  return {
    mostUsedWords: state.mostUsedWords,
  };
};

MostUsedWords = connect(mapStateToProps)(MostUsedWords);
export default MostUsedWords;
