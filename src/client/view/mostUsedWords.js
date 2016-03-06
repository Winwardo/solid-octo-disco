import React from 'react';
import { CoolSearchBar } from './searchBar';

const WordInfo = ({ word, count }) => (
  <tr>
    <td className='right aligned column'>{count}</td>
    <td className='left aligned column'>{word}</td>
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
      <div style={{'height': '300px', 'overflow-y': 'scroll'}}>
        <table className="ui very basic celled table">
          <tbody>
          {
            this.props.words.map((word) => {
              return (
                <WordInfo word={word.word} count={word.count}></WordInfo>
              );
            })
          }
          </tbody>
        </table>
      </div>
    );
  },
});

const ToggleAllWords = () => (
  <button className="ui button">Hide all</button>
)


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
    const self = this;
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
              <ToggleAllWords />
            </div>
          </div>
          <br/>
          <Words words={self.filterWords()}/>
        </div>
      </div>
    );
  },
});