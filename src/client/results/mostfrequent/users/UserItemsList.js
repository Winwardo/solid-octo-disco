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
              <th className="two wide"></th>
              <th className="three wide"></th>
              <th className="two wide"></th>
              <th className="seven wide"></th>
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
    <td className="right aligned">
      <img className="ui avatar image" src="" />
    </td>

    <td>
      <div className="header">
        {userInfo.author.name} <a>@{userInfo.author.handle}</a>
      </div>
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
