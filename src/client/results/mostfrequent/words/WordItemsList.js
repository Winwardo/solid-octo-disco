import React, { Component } from 'react';

class WordItemsList extends Component {
  componentDidMount() {
    if (this.props.isWordsToggledActionHide) {
      $('.ui.checkbox.words').checkbox('check');
    } else {
      $('.ui.checkbox.words').checkbox('uncheck');
    }
    $('.ui.accordion.words').accordion({
      selector: {
        trigger: '.title .conflated-word-selector',
      },
    });
  }

  componentDidUpdate(nextProps) {
    if (nextProps.isWordsToggledActionHide !== this.props.isWordsToggledActionHide) {
      if (this.props.isWordsToggledActionHide) {
        $('.ui.checkbox.words').checkbox('check');
      } else {
        $('.ui.checkbox.words').checkbox('uncheck');
      }
    }
  }

  render() {
    return (
      <div style={{ height: '300px', overflowY: 'scroll' }}>
        <div className="ui fluid accordion words" style={{ overflow: 'hidden' }}>
          {this.props.words.map((wordInfo, id) =>
            <ConflatedWordItem key={wordInfo.word} accordianIndex={id}
              conflatedWordInfo={wordInfo}
              toggleMostUsedWords={this.props.toggleMostUsedWords}
            />
          )}
        </div>
      </div>
    );
  }
}
WordItemsList.propTypes = {
  words: React.PropTypes.array,
  isWordsToggledActionHide: React.PropTypes.bool,
};

const ConflatedWordItem = ({ accordianIndex, toggleMostUsedWords, conflatedWordInfo }) => (
  <div>
    <div className="title">
      <div className="ui grid">
        <div className="twelve wide column conflated-word-selector">
          <div className="ui twelve column grid">
            <div className="two wide right aligned column">
              <div className="statistic">
                {conflatedWordInfo.count}
              </div>
            </div>
            <div className="ten wide column">
              {conflatedWordInfo.word} <i className="dropdown icon" />
            </div>
          </div>
        </div>
        <div className="four wide column">
          <div data-id={`${conflatedWordInfo.word}master`} className="ui checkbox words" onClick={() => {
            // Makes sure the accordian is open so that the user can see which words are being toggled
            $('.ui.accordion.words').accordion('open', accordianIndex);

            // Sets the semantic-ui checkbox action method dependant on whether
            // the master checkbox(conflated word) is checked/unchecked after being clicked
            const masterChecked = $(`.ui.checkbox.words[data-id="${conflatedWordInfo.word}master"]`).checkbox('is checked');
            const action = getSemanticCheckboxActionName(masterChecked);

            // Created an array of toggle words to send a single redux action instead of several
            let toggleWords = [];

            // Loops through each child checkboxes'(conflated word's variants)
            $(`.ui.checkbox.words[data-id^="${conflatedWordInfo.word}child"]`).each((index) => {
              const $childCheckbox = $(`.ui.checkbox.words[data-id="${conflatedWordInfo.word}child${index}"]`);

              // To see if it's the same checked/unchecked state as the master(conflated word).
              // This is to make sure that it doesn't toggle words that aren't meant to be
              // toggled in the state tree.
              if ($childCheckbox.checkbox('is checked') !== masterChecked) {
                $childCheckbox.checkbox(action);
                toggleWords.push(conflatedWordInfo.makeup[index].word);
              }
            });

            // Sends off the action with the children's conflated word's variants that need to be toggled.
            toggleMostUsedWords(toggleWords);
          }}>
            <label>Show</label>
            <input type="checkbox" name="example" />
          </div>
        </div>
      </div>
    </div>
    <div className="content">
      <table className="ui very basic celled table">
        <tbody>
          {
            conflatedWordInfo.makeup.map((makeupInfo, id) => (
              <WordItem key={makeupInfo.word} conflatedWord={`${conflatedWordInfo.word}`}
                checkboxId={id}
                makeupInfo={makeupInfo}
                conflatedWordCount={conflatedWordInfo.count}
                toggleMostUsedWords={toggleMostUsedWords}
              />
            ))
          }
        </tbody>
      </table>
    </div>
  </div>
);

const WordItem = ({ toggleMostUsedWords, makeupInfo, conflatedWord, checkboxId, conflatedWordCount }) => (
  <tr>
    <td className="right aligned" style={{ width: '60px' }}>
      {Math.round(makeupInfo.count / conflatedWordCount * 100)}%
    </td>
    <td className="right aligned" style={{ width: '60px' }}>{makeupInfo.count}</td>
    <td>{makeupInfo.word}</td>
    <td>
      <div data-id={`${conflatedWord}child${checkboxId}`} className="ui checkbox words" onClick={() => {
        toggleMostUsedWords([makeupInfo.word]);
        const $thisCheckbox = $(`.ui.checkbox.words[data-id^="${conflatedWord}child${checkboxId}"]`).checkbox('is checked');
        const action = getSemanticCheckboxActionName($thisCheckbox);

        // Checks if all the other conflated word's variants are the same state (checked/unchecked)
        let allCheckboxesSame = true;
        $(`.ui.checkbox.words[data-id^="${conflatedWord}child"]`).each((index) => {
          if ($thisCheckbox !== $(`.ui.checkbox.words[data-id^="${conflatedWord}child${index}"]`).checkbox('is checked')) {
            allCheckboxesSame = false;
          }
        });

        // If they are, then check/uncheck the master checkbox
        if (allCheckboxesSame) {
          $(`.ui.checkbox.words[data-id="${conflatedWord}master"]`).checkbox(action);
        }
      }}>
        <label>Show</label>
        <input type="checkbox" name="example" />
      </div>
    </td>
  </tr>
);

/**
 * Sets the semantic-ui checkbox action method dependant on whether isChecked
 * @param Boolean
 * @returns String
 */
const getSemanticCheckboxActionName = (isChecked) => {
  if (isChecked) {
    return 'check';
  } else {
    return 'uncheck';
  }
};

export default WordItemsList;
