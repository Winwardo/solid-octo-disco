import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

class Feed extends Component {
  componentDidMount() {
    $('.popup').popup();
  }

  componentDidUpdate() {
    $('.popup').popup();
    NProgress.done();
  }

  render() {
    const filteredFeed = filterPostsForFeed(this.props.feed, this.props.hiddenWords);
    const hiddenPostCount = this.props.feed.length - filteredFeed.length;

    let hiddenPostMessage;
    if (hiddenPostCount > 0) {
      hiddenPostMessage = (<span>Hiding {hiddenPostCount} posts</span>);
    }

    return (
      <div>
        <h3>Search results, showing {filteredFeed.length} unique posts.</h3>
        {hiddenPostMessage}
        <div className = "ui divided items">
          {filteredFeed.map((feedItem, id) => (<FeedItem content = {feedItem} key = {feedItem.data.id}/>))}
        </div>
      </div>
    );
  }
};

const filterPostsForFeed = (feed, hiddenWords) => {
  if (hiddenWords.length === 0) {
    return feed;
  }

  return feed.filter((feedItem) => {
      const content = feedItem.data.content;

      // If we can find the chosen hidden word in this tweet, block the post
      for (const hiddenWord of hiddenWords) {
        if (content.indexOf(hiddenWord) > -1) {
          return false;
        }
      }

      return true;
    }
  )
};

const FeedItem = ({ content }) => {
  let post;
  switch (content.source) {
    case 'twitter': post = <Tweet content={content}/>;
  };

  return (
    <div className="item">
      <div className="meta" style={{ minWidth: '40px', textAlign: 'center', verticalAlign: 'middle' }}>
        <i className={`${content.source} icon`}/>
      </div>
      {post}
    </div>
  );
};

const Tweet = ({content}) => (
  <div className="content">
    <div className="header">{content.author.name}</div>                                                      <a href={`//twitter.com/${content.author.handle}`}>@{content.author.handle}</a>
    <br />
    {content.data.content}

    <div className="meta">
      <span className="date">
        <a href={`//twitter.com/${content.author.handle}/status/${content.data.id}`}>
          {moment(content.data.date).calendar()}
        </a>
      </span>
      |
      <span className="likes popup" data-title="Likes">
        <i className="like icon"/>{content.data.likes}
      </span>
      |
      <span className="retweets popup" data-title="Retweets">
        <i className="retweet icon"/>{content.data.retweets}
      </span>
    </div>
  </div>
);

const mapStateToProps = (state) => ({
  feed: state.feed,
  hiddenWords: state.mostUsedWords.wordsToHide,
});

export default connect(mapStateToProps)(Feed);
