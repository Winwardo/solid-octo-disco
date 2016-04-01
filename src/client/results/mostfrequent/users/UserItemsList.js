import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleMostActiveUser } from './../mostFrequentActions';
import { mostFrequentWords } from './../../../tweetAnalysis';

class UserItemsList extends Component {
  componentDidMount() {
    $('.ui.checkbox').checkbox();
    $('.ui.dropdown').dropdown();
  }

  componentDidUpdate() {
    $('.ui.checkbox').checkbox();
  }

  render() {
    return (
      <div>
        <table className="ui very basic table">
          <thead>
            <tr>
              <th className="eight wide"></th>
              <th className="one wide"></th>
              <th className="six wide">
                <i className="trophy yellow icon"></i>
                Top Words
              </th>
              <th className="one wide">Show</th>
            </tr>
          </thead>
          <tbody>
            { this.props.users.map((userInfo, id) =>
              <UserItem key={id} userInfo={userInfo} />) }
          </tbody>
        </table>
      </div>
    );
  }
}

let UserItem = ({ dispatch, userInfo }) => (
  <tr>
    <td className="left aligned">
      <h4 className="ui image header">
        <img className="ui mini rounded image"
          src={userInfo.author.profile_image_url}
          alt={`${userInfo.author.name}'s Twitter profile picture`}
        />
        <div className="content">
          <a href={`//twitter.com/${userInfo.author.handle}`} target="_blank">
            <strong className="tweet fullname">{userInfo.author.name}</strong>
            <div className="sub header tweet handle">@{userInfo.author.handle}</div>
          </a>
        </div>
      </h4>
    </td>

    <td>
      <i className={`${userInfo.source} blue icon`}>{userInfo.posts.length}</i>
    </td>

    <td>
      <UserItemMostUsedWords
        usersMostUsedWords={mostFrequentWords(userInfo.posts.map(post => post.content))}
      />
    </td>

    <td className="left aligned">
      <div className="ui checkbox" onClick={() => {
        dispatch(toggleMostActiveUser(userInfo.author.id));
      }}>
        <input type="checkbox" name="example" defaultChecked="true" />
      </div>
    </td>
  </tr>
);
UserItem = connect()(UserItem);

const UserItemMostUsedWords = ({ usersMostUsedWords }) => (
  <div className="ui pointing fluid dropdown">
    <div className="text"><b>{usersMostUsedWords[0].word}</b> x{usersMostUsedWords[0].count}</div>
    <i className="dropdown icon"></i>
    <div className="menu">
      {usersMostUsedWords.slice(1).map(
        frequentWord => (
          <div className="item">
            <b>{frequentWord.word}</b> x{frequentWord.count}
          </div>
        )
      )}
    </div>
  </div>
);

export default UserItemsList;
