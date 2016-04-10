import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleMostActiveUser } from './../mostFrequentActions';
import { mostFrequentWords } from './../../../tweetAnalysis';
import { TwitterProfilePicture } from '../../../Twitter';

class UserItemsList extends Component {
  componentDidMount() {
    if (this.props.isUsersToggledActionHide) {
      $('.ui.checkbox.users').checkbox('check');
    } else {
      $('.ui.checkbox.users').checkbox('uncheck');
    }
    $('.ui.dropdown.userwords').dropdown({
      action: 'nothing',
    });
    $('#userItemsList').css('height', `${$(window).height() - ($(window).height() / 5)}px`);
  }

  componentDidUpdate(nextProps) {
    // only re-check or unckeck if the usersToggleActionHide has changed
    // or the feed posts have changed
    if (
      nextProps.isUsersToggledActionHide !== this.props.isUsersToggledActionHide ||
      nextProps.postsLength !== this.props.postsLength
    ) {
      if (this.props.isUsersToggledActionHide) {
        $('.ui.checkbox.users').checkbox('check');
      } else {
        $('.ui.checkbox.users').checkbox('uncheck');
      }
    }
    $('.ui.dropdown.userwords').dropdown({
      action: 'nothing',
    });
    $('#userItemsList').css('height', `${$(window).height() - ($(window).height() / 5)}px`);
  }

  render() {
    return (
      <div id="userItemsList" style={{ overflowY: 'scroll' }}>
        <table className="ui very basic table" style={{ overflowY: 'hidden' }} >
          <thead>
            <tr>
              <th className="eight wide"></th>
              <th className="one wide"></th>
              <th className="six wide" style={{ paddingLeft: '0px' }}>
                <i className="trophy yellow icon"></i>
                Top Words
              </th>
              <th className="one wide" style={{ borderLeft: '2px solid rgba(34,36,38,.1)' }}>Show</th>
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
UserItemsList.propTypes = {
  users: React.PropTypes.array,
  isUsersToggledActionHide: React.PropTypes.bool,
  postsLength: React.PropTypes.number,
};

let UserItem = ({ dispatch, userInfo }) => (
  <tr>
    <td className="left aligned" style={{ paddingRight: '0px' }}>
      <h4 className="ui image header">
        <TwitterProfilePicture author={userInfo.author} size="mini" />
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

    <td style={{ paddingLeft: '0px' }}>
      <UserItemMostUsedWords
        usersMostUsedWords={mostFrequentWords(userInfo.posts.map(post => post.content))}
      />
    </td>

    <td className="center aligned" style={{ borderLeft: '1px solid rgba(34,36,38,.1)' }}>
      <div className="ui checkbox users" onClick={() => {
        dispatch(toggleMostActiveUser(userInfo.author.id));
      }}>
        <input type="checkbox" name="example" />
      </div>
    </td>
  </tr>
);
UserItem = connect()(UserItem);

const UserItemMostUsedWords = ({ usersMostUsedWords }) => {
  let topWord = { word: 'N/A', count: 0 };
  if (usersMostUsedWords[0] !== undefined) {
    topWord = usersMostUsedWords[0];
  }

  return (
    <div className="ui fluid pointing dropdown userwords">
      <div className="text"><strong>{topWord.word}</strong> x{topWord.count}</div>
      <i className="dropdown icon" style={{ marginLeft: '0px', marginTop: '2px' }}></i>
      <div className="menu">
        {usersMostUsedWords.slice(1).map(
          frequentWord => (
            <div className="item" key={frequentWord.word}>
              <strong>{frequentWord.word}</strong> x{frequentWord.count}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default UserItemsList;
