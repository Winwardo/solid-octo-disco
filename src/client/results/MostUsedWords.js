import React, { Component } from 'react';
import { connect } from 'react-redux';
import SlidingSearchBar from './SearchBar';
import { toggleMostUsedWord, showMostUsedWord } from './mostUsedWordsActions';

let MostUsedWords = ({ wordInfoList, search, mostUsedWords }) => {
  const filteredWords = () => (
    wordInfoList
      .filter((wordInfo) => wordInfo.word.toLowerCase().includes(mostUsedWords.filterTerm.toLowerCase()))
      .slice(0, 100)
  );

  return (
    <div>
      <h3>Most frequent words</h3>
      <div>
        <div className='ui two column grid'>
          <div className='column'>
            <SlidingSearchBar searchFor='MOST_USED_WORDS_FILTER' currentValue={mostUsedWords.filterTerm} />
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
    $('.ui.accordion').accordion();
  }

  componentDidUpdate() {
    $('.ui.checkbox').checkbox();
    $('.ui.accordion').accordion();
  }

  render() {
    return (
      <div style={{ height: '300px', overflowY: 'scroll' }}>
        <div className='ui fluid accordion' style={{ overflow:'hidden' }}>
          { this.props.words.map((wordInfo) => <ConflatedWordItem key={wordInfo.word} conflatedWordInfo={wordInfo} />) }
        </div>
      </div>
    );
  }
};

const ConflatedWordItem = ({ key, conflatedWordInfo }) => (
  <div>
    <div className='title'>
      <div className="ui grid">
        <div className="two wide right aligned column">
          <div className='statistic'>
            {conflatedWordInfo.count}
          </div>
        </div>
        <div className="fourteen wide column">
          {conflatedWordInfo.word} <i className='dropdown icon' />
        </div>
      </div>
    </div>
    <div className='content'>
      <table className='ui very basic celled table'>
        <tbody>
          {
            conflatedWordInfo.makeup.map((makeupInfo) => (
              <WordItem key={makeupInfo.word} makeupInfo={makeupInfo} conflatedWordCount={conflatedWordInfo.count} />
            ))
          }
        </tbody>
      </table>
    </div>
  </div>
);

let WordItem = ({ dispatch, makeupInfo, conflatedWordCount }) => (
  <tr>
    <td className='right aligned' style={{ width: '60px' }}>{Math.round(makeupInfo.count / conflatedWordCount * 100)}%</td>
    <td className='right aligned' style={{ width: '60px' }}>{makeupInfo.count}</td>
    <td>{makeupInfo.word}</td>
    <td>
      <div className="ui checkbox" onClick={(e) => {
        NProgress.start();
        dispatch(toggleMostUsedWord(makeupInfo.word));
      }}>
        <label>Show</label>
        <input type="checkbox" name="example" checked="true" />
      </div>
    </td>
  </tr>
);
WordItem = connect()(WordItem);

const ToggleAllWords = () => (
  <button className='ui button'>Hide all</button>
);

const mapStateToProps = (state) => ({
  mostUsedWords: state.mostUsedWords,
});

MostUsedWords = connect(mapStateToProps)(MostUsedWords);
export default MostUsedWords;
