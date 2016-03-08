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
    $('.ui.accordion').accordion();
  }

  componentDidUpdate() {
    $('.ui.checkbox').checkbox();
    $('.ui.accordion').accordion();
  }

  render() {
    return (
      <div style={{ height: '300px', overflowY: 'scroll' }}>
        <div className='ui fluid accordion' style={{overflow:'hidden'}}>
          { this.props.words.map((wordInfo, id) => <WordItem key={id} wordInfo={wordInfo} />) }
        </div>
      </div>
    );
  }
};

const WordItem = ({ wordInfo }) => (
  <div>
    <div className='title'>
      <div className="ui grid">
        <div className="two wide right aligned column"><div className='statistic'>{wordInfo.count}</div></div>
        <div className="twelve wide column">{wordInfo.word} <i className='dropdown icon' /></div>
      </div>
    </div>
    <div className='content'>
      <table className='ui very basic celled table'>
        <tbody>
          {
            wordInfo.makeup.map((makeupInfo) => (
                  <tr>
                    <td className='right aligned' style={{width: '60px'}}>{Math.round(makeupInfo.count / wordInfo.count * 100)}%</td>
                    <td>{makeupInfo.word}</td>
                    <td>
                      <div className="ui checkbox">
                        <label>Show</label>
                        <input type="checkbox" name="example" checked="true"/>
                      </div>
                    </td>
                  </tr>
              )
            )
          }
        </tbody>
      </table>
    </div>
  </div>
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
