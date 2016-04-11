import React, { Component } from 'react';

class WordItemsList extends Component {
  componentDidMount() {
    // change height to bottom of the page
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
    $('.wordItemList').css('height', `${$(window).height() - ($(window).height() / 5)}px`);
  }

  componentDidUpdate(nextProps) {
    if (
      nextProps.isWordsToggledActionHide !== this.props.isWordsToggledActionHide ||
      nextProps.postsLength !== this.props.postsLength
    ) {
      if (this.props.isWordsToggledActionHide) {
        $('.ui.checkbox.words').checkbox('check');
      } else {
        $('.ui.checkbox.words').checkbox('uncheck');
      }
    }
    // change height to bottom of the page
    $('.wordItemList').css('height', `${$(window).height() - ($(window).height() / 5)}px`);
  }

  render() {
    return (
      <div className="wordItemList" style={{ overflowY: 'scroll' }}>
        <div data-id={this.props.componentId} className="ui fluid accordion words" style={{ overflow: 'hidden' }}>
          {this.props.words.map((wordInfo, id) =>
            <ConflatedWordItem key={wordInfo.word} accordianIndex={id}
              componentId={this.props.componentId}
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
  componentId: React.PropTypes.string,
  words: React.PropTypes.array,
  isWordsToggledActionHide: React.PropTypes.bool,
  postsLength: React.PropTypes.number,
};

const ConflatedWordItem = ({ componentId, accordianIndex, toggleMostUsedWords, conflatedWordInfo }) => (
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
            <div className="eleven wide column">
              {conflatedWordInfo.word} <i className="dropdown icon" />
            </div>
          </div>
        </div>
        <div className="three wide column">
          <div data-id={`${conflatedWordInfo.word}master${componentId}`} className="ui checkbox words" onClick={() => {
            // Makes sure the accordian is open so that the user can see which words are being toggled
            $(`.ui.accordion.words[data-id=${componentId}]`).accordion('open', accordianIndex);

            // Sets the semantic-ui checkbox action method dependant on whether
            // the master checkbox(conflated word) is checked/unchecked after being clicked
            const masterChecked = $(`.ui.checkbox.words[data-id="${conflatedWordInfo.word}master${componentId}"]`).checkbox('is checked');
            const action = getSemanticCheckboxActionName(masterChecked);

            // Created an array of toggle words to send a single redux action instead of several
            let toggleWords = [];

            // Loops through each child checkboxes'(conflated word's variants)
            $(`.ui.checkbox.words[data-id^="${conflatedWordInfo.word}child${componentId}"]`).each((index) => {
              console.log('works!')
              const $childCheckbox = $(`.ui.checkbox.words[data-id="${conflatedWordInfo.word}child${componentId}${index}"]`);
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
            <input type="checkbox" name="example" />
          </div>
        </div>
      </div>
    </div>
    <div className="content">
      <table className="ui very basic celled unstackable table">
        <tbody>
          {
            conflatedWordInfo.makeup.map((makeupInfo, id) => (
              <WordItem componentId={componentId} key={makeupInfo.word}
                conflatedWord={`${conflatedWordInfo.word}`}
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

const WordItem = ({ componentId, toggleMostUsedWords, makeupInfo, conflatedWord, checkboxId, conflatedWordCount }) => (
  <tr>
    <td className="right aligned" style={{ width: '60px' }}>
      {Math.round(makeupInfo.count / conflatedWordCount * 100)}%
    </td>
    <td className="right aligned" style={{ width: '60px' }}>{makeupInfo.count}</td>
    <td>{makeupInfo.word}</td>
    <td>
      <div data-id={`${conflatedWord}child${componentId}${checkboxId}`} className="ui checkbox words" onClick={() => {
        toggleMostUsedWords([makeupInfo.word]);
        const $thisCheckbox = $(`.ui.checkbox.words[data-id^="${conflatedWord}child${componentId}${checkboxId}"]`).checkbox('is checked');
        const action = getSemanticCheckboxActionName($thisCheckbox);

        // Checks if all the other conflated word's variants are the same state (checked/unchecked)
        let allCheckboxesSame = true;
        $(`.ui.checkbox.words[data-id^="${conflatedWord}child${componentId}"]`).each((index) => {
          if ($thisCheckbox !== $(`.ui.checkbox.words[data-id^="${conflatedWord}child${componentId}${index}"]`).checkbox('is checked')) {
            allCheckboxesSame = false;
          }
        });

        // If they are, then check/uncheck the master checkbox
        if (allCheckboxesSame) {
          $(`.ui.checkbox.words[data-id="${conflatedWord}master${componentId}"]`).checkbox(action);
        }
      }}>
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
