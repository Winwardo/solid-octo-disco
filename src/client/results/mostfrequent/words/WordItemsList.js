import React, { Component } from 'react';
import { connect } from 'react-redux';

class WordItemsList extends Component {
  componentDidMount() {
    if(this.props.wordsToggledAction) {
      $('.ui.checkbox.words').checkbox('check');
    } else {
      $('.ui.checkbox.words').checkbox('uncheck');
    }
    $('.ui.accordion').accordion();
  }

  componentDidUpdate(nextProps) {
    if (nextProps.wordsToggledAction !== this.props.wordsToggledAction) {
      if (this.props.wordsToggledAction) {
        $('.ui.checkbox.words').checkbox('check');
      } else {
        $('.ui.checkbox.words').checkbox('uncheck');
      }
    }
    $('.ui.accordion').accordion();
  }

  render() {
    return (
      <div style={{ height: '300px', overflowY: 'scroll' }}>
        <div className="ui fluid accordion" style={{ overflow: 'hidden' }}>
          { this.props.words.map((wordInfo, id) =>
            <ConflatedWordItem key={wordInfo.word} conflatedWordInfo={wordInfo} toggleMostUsedWord={this.props.toggleMostUsedWord} />) }
        </div>
      </div>
    );
  }
}

const ConflatedWordItem = ({ toggleMostUsedWord, conflatedWordInfo }) => (
  <div>
    <div className="title">
      <div className="ui grid">
        <div className="two wide right aligned column">
          <div className="statistic">
            {conflatedWordInfo.count}
          </div>
        </div>
        <div className="fourteen wide column">
          {conflatedWordInfo.word} <i className="dropdown icon" />
        </div>
      </div>
    </div>
    <div className="content">
      <table className="ui very basic celled table">
        <tbody>
          {
            conflatedWordInfo.makeup.map((makeupInfo) => (
              <WordItem key={makeupInfo.word}
                makeupInfo={makeupInfo}
                conflatedWordCount={conflatedWordInfo.count}
                toggleMostUsedWord={toggleMostUsedWord}
              />
            ))
          }
        </tbody>
      </table>
    </div>
  </div>
);

const WordItem = ({ toggleMostUsedWord, makeupInfo, conflatedWordCount }) => (
  <tr>
    <td className="right aligned" style={{ width: '60px' }}>
      {Math.round(makeupInfo.count / conflatedWordCount * 100)}%
    </td>
    <td className="right aligned" style={{ width: '60px' }}>{makeupInfo.count}</td>
    <td>{makeupInfo.word}</td>
    <td>
      <div className="ui checkbox words" onClick={() => {
        toggleMostUsedWord(makeupInfo.word);
      }}>
        <label>Show</label>
        <input type="checkbox" name="example" />
      </div>
    </td>
  </tr>
);

export default WordItemsList;
