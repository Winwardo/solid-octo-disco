import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleMostActiveUser } from './../mostFrequentActions';

class UserItemsList extends Component {
  componentDidMount() {
    $('.ui.checkbox').checkbox();
  }

  componentDidUpdate() {
    $('.ui.checkbox').checkbox();
  }

  render() {
    return (
      <div style={{ height: '300px', overflowY: 'scroll' }}>
        <table className="ui very basic table">
          <thead>
            <tr>
              <th className="eight wide"></th>
              <th className="two wide"></th>
              <th className="four wide"></th>
              <th className="two wide"></th>
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
      Most Used Words
    </td>

    <td className="left aligned">
      <div className="ui checkbox" onClick={() => {
        dispatch(toggleMostActiveUser(userInfo.author.id));
      }}>
        <label>Show</label>
        <input type="checkbox" name="example" defaultChecked="true" />
      </div>
    </td>
  </tr>
);
UserItem = connect()(UserItem);

export default UserItemsList;
