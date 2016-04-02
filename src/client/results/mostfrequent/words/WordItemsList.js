import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleMostUsedWord } from './../mostFrequentActions';

class WordItemsList extends Component {
  componentDidMount() {
    if(this.props.wordsToggledAction) {
      $('.ui.checkbox.words').checkbox('check');
    } else {
      $('.ui.checkbox.words').checkbox('uncheck');
    }
    $('.ui.accordion').accordion();
  }

  componentDidUpdate() {
    if(this.props.wordsToggledAction) {
      $('.ui.checkbox.words').checkbox('check');
    } else {
      $('.ui.checkbox.words').checkbox('uncheck');
    }
    $('.ui.accordion').accordion();
  }

  render() {
    return (
      <div style={{ height: '300px', overflowY: 'scroll' }}>
        <div className="ui fluid accordion" style={{ overflow: 'hidden' }}>
          { this.props.words.map((wordInfo, id) =>
            <ConflatedWordItem key={id} conflatedWordInfo={wordInfo} />) }
        </div>
      </div>
    );
  }
}

const ConflatedWordItem = ({ conflatedWordInfo }) => (
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
            conflatedWordInfo.makeup.map((makeupInfo, id) => (
              <WordItem key={id} makeupInfo={makeupInfo} conflatedWordCount={conflatedWordInfo.count} />
            ))
          }
        </tbody>
      </table>
    </div>
  </div>
);

let WordItem = ({ dispatch, makeupInfo, conflatedWordCount }) => (
  <tr>
    <td className="right aligned" style={{ width: '60px' }}>
      {Math.round(makeupInfo.count / conflatedWordCount * 100)}%
    </td>
    <td className="right aligned" style={{ width: '60px' }}>{makeupInfo.count}</td>
    <td>{makeupInfo.word}</td>
    <td>
      <div className="ui checkbox words" onClick={() => {
        dispatch(toggleMostUsedWord(makeupInfo.word));
      }}>
        <label>Show</label>
        <input type="checkbox" name="example" />
      </div>
    </td>
  </tr>
);
WordItem = connect()(WordItem);

export default WordItemsList;
