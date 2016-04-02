import React, { Component } from 'react';
import { connect } from 'react-redux';
import Feed from './Feed';
import MostUsedWords from './mostfrequent/words/MostUsedWords';
import MostActiveUsers from './mostfrequent/users/MostActiveUsers';

let Results = ({ feed, mostFrequent }) => {
  const posts = feed.posts;
  if (posts.length === 0) {
    return (
      <div className="ui violet inverted center aligned segment">
        <h2 className="ui inverted header">
          <div className="sub header">
            Start using Socto by typing into the search bar or by using the filters.
          </div>
        </h2>
      </div>
    );
  }

  return (
    <div className="ui grid">
      <div className="four wide column">
        <MostActiveUsers filterTerm={mostFrequent.users.filterTerm}
          userInfoList={feed.mostFrequentUsers}
          usersToggledAction={mostFrequent.users.isToggledActionHide}
        />
      </div>

      <div className="eight wide column">
        <Feed feed={posts}
          toggledWords={mostFrequent.words.toToggle}
          wordsToggledAction={mostFrequent.words.isToggledActionHide}
          toggledUsers={mostFrequent.users.toToggle}
          usersToggledAction={mostFrequent.users.isToggledActionHide}
          paginationInfo={feed.paginationInfo}
        />
      </div>

      <div className="four wide column">
        <MostUsedWords filterTerm={mostFrequent.words.filterTerm}
          wordInfoList={feed.groupedMostFrequentWords}
          wordsToggledAction={mostFrequent.words.isToggledActionHide}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  feed: state.feed,
  mostFrequent: state.mostFrequent,
});

Results = connect(mapStateToProps)(Results);
export default Results;
