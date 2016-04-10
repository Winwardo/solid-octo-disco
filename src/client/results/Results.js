import React, { Component } from 'react';
import { connect } from 'react-redux';
import Feed from './Feed';
import MostUsedWords from './mostfrequent/words/MostUsedWords';
import MostActiveUsers from './mostfrequent/users/MostActiveUsers';
import GoogleMap from './GoogleMap';

class Results extends Component {
  componentDidUpdate() {
    $('.ui.sticky').sticky({ context: '#feed' });
  }

  render() {
    const { mostFrequent, feed } = this.props;

    const posts = feed.posts;
    if (posts.length === 0) {
      return (
        <div className="row">
          <div className="column">
            <div className="ui violet inverted center aligned segment">
              <h3 className="ui inverted header">
                Start using Socto by typing into the search bar or by using the filters.
              </h3>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="row" style={{ margin: '0px 25px' }}>
        <div className="four wide column">
          <div className="ui sticky">
            <MostActiveUsers filterTerm={mostFrequent.users.filterTerm}
              userInfoList={feed.mostFrequentUsers}
              isUsersToggledActionHide={mostFrequent.users.isToggledActionHide}
              postsLength={posts.length}
            />
          </div>
        </div>

        <div id="feed" className="eight wide column">
          <Feed feed={posts}
            toggledWords={mostFrequent.words.toToggle}
            isWordsToggledActionHide={mostFrequent.words.isToggledActionHide}
            toggledUsers={mostFrequent.users.toToggle}
            isUsersToggledActionHide={mostFrequent.users.isToggledActionHide}
            paginationInfo={feed.paginationInfo}
          />

          <div id="tweetMap" style={{ height: '500px', width: '100%' }} />
          <GoogleMap posts={posts.filter((post) => post.data.longitude !== 0)} />
        </div>

        <div className="four wide column">
          <div className="ui sticky">
            <MostUsedWords filterTerm={mostFrequent.words.filterTerm}
              wordInfoList={feed.groupedMostFrequentWords}
              isWordsToggledActionHide={mostFrequent.words.isToggledActionHide}
              postsLength={posts.length}
            />
          </div>
        </div>

        <div className={`ui ${feed.posts.length > 0 && feed.fetchingRequestFromDB && 'active'} dimmer`}>
          <div className="content">
            <div className="center">
              <h2 className="ui inverted icon header">
                <div className="ui large text loader">Fetching posts from the database!</div>
              </h2>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
Results.propTypes = {
  feed: React.PropTypes.object,
  mostFrequent: React.PropTypes.object,
};

const mapStateToProps = (state) => ({
  feed: state.feed,
  mostFrequent: state.mostFrequent,
});

Results = connect(mapStateToProps)(Results);
export default Results;
