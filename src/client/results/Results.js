import React, { Component } from 'react';
import { connect } from 'react-redux';
import Feed from './Feed';
import MostUsedWords from './mostfrequent/words/MostUsedWords';
import MostActiveUsers from './mostfrequent/users/MostActiveUsers';
import GoogleMap from './GoogleMap';

class Results extends Component {
  componentDidMount() {
    $('.ui.sticky').sticky({ context: '#feed' });
    $('.tabular.menu.results .item.active').tab();
  }

  componentDidUpdate() {
    $('.ui.sticky').sticky({ context: '#feed' });
    $('.tabular.menu.results .item').tab();
  }

  render() {
    const { mostFrequent, feed } = this.props;

    const posts = feed.posts;
    if (posts.length === 0) {
      return (
        <div className="row">
          <div className="col-xs-12">
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
      <div style={{ width: '100%' }}>
        <div className="row" style={{ margin: '0px 25px' }}>
          <div className="hidden-md-down col-lg-4">
            <div className="ui sticky">
              <MostActiveUsers filterTerm={mostFrequent.users.filterTerm}
                userInfoList={feed.mostFrequentUsers}
                isUsersToggledActionHide={mostFrequent.users.isToggledActionHide}
                postsLength={posts.length}
              />
            </div>
          </div>

          <div className="col-sm-12 col-md-6 col-md-push-6 hidden-lg-up">
            <div className="ui tabular menu results">
              <div className="purple item active" data-tab="top-users">Top Users</div>
              <div className="purple item" data-tab="top-words">Top Words</div>
            </div>
            <div className="ui tab active" data-tab="top-users">
              <MostActiveUsers filterTerm={mostFrequent.users.filterTerm}
                userInfoList={feed.mostFrequentUsers}
                isUsersToggledActionHide={mostFrequent.users.isToggledActionHide}
                postsLength={posts.length}
              />
            </div>
            <div className="ui tab" data-tab="top-words">
              <MostUsedWords filterTerm={mostFrequent.words.filterTerm}
                wordInfoList={feed.groupedMostFrequentWords}
                isWordsToggledActionHide={mostFrequent.words.isToggledActionHide}
                postsLength={posts.length}
                componentId="1"
              />
            </div>
          </div>

          <div id="feed" className="col-sm-12 col-md-6 col-md-pull-6 col-lg-5 col-lg-pull-0">
            <div className="hidden-md-down row">
              <div id="tweetMap" style={{ height: '450px', width: '100%' }} ></div>
              <GoogleMap posts={posts.filter((post) => post.data.longitude !== 0)} />
            </div>


            <div className="row">
              <Feed feed={posts}
                toggledWords={mostFrequent.words.toToggle}
                isWordsToggledActionHide={mostFrequent.words.isToggledActionHide}
                toggledUsers={mostFrequent.users.toToggle}
                isUsersToggledActionHide={mostFrequent.users.isToggledActionHide}
                paginationInfo={feed.paginationInfo}
              />
            </div>
          </div>

          <div className="hidden-md-down col-lg-3">
            <div className="ui sticky">
              <MostUsedWords filterTerm={mostFrequent.words.filterTerm}
                wordInfoList={feed.groupedMostFrequentWords}
                isWordsToggledActionHide={mostFrequent.words.isToggledActionHide}
                postsLength={posts.length}
                componentId="2"
              />
            </div>
          </div>

        </div>
        <div className={`ui ${feed.posts.length > 0 && feed.fetchingRequestFromDB && 'active'} purple dimmer`}
          style={{ position: 'fixed'}}
        >
          <div className="content">
            <div className="center">
              <h2 className="ui inverted icon header">
                <div className="ui large text loader">Fetching posts from the database</div>
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
