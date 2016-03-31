import React, { Component } from 'react';
import moment from 'moment';

const Feed = ({ feed, hiddenWords, hiddenUsers }) => {
  const filteredFeed = filterPostsForFeed(feed, hiddenWords, hiddenUsers);

  return (
    <div>
      <div className="ui two column grid">
        <div className="column">
          <h3>Search results</h3>
        </div>
        <div className="right aligned column">
          Showing {filteredFeed.length}/{feed.length} posts
        </div>
      </div>
      <div className="ui divided items">
        {filteredFeed.map((feedItem) => (<FeedItem content={feedItem} />))}
      </div>
    </div>
  );
};

const filterPostsForFeed = (feed, hiddenWords, hiddenUsers) => (
  feed.filter((feedItem) => {
    const content = feedItem.data.content;
    const authorId = feedItem.author.id;

    // If we can find the chosen hidden word in this tweet, block the post
    for (const hiddenWord of hiddenWords) {
      if (content.indexOf(hiddenWord) > -1) {
        return false;
      }
    }

    for (const hiddenUser of hiddenUsers) {
      if (authorId === hiddenUser) {
        return false;
      }
    }

    return true;
  }
));

const FeedItem = ({ content }) => {
  let post;
  switch (content.source) {
    case 'twitter': post = <Tweet content={content} />;
  }

  return (
    <div className="item">
      <div className="meta"
           style={{ minWidth: '40px', textAlign: 'center', verticalAlign: 'middle' }}
      >
        <i className={`${content.source} icon`} />
        <br />
      </div>
      {post}
    </div>
  );
};

class Tweet extends Component {
  componentDidMount() {
    $('.popup').popup();
  }

  render() {
    const content = this.props.content;

    let goldStar;
    if (content.data.likes + content.data.retweets > 10) {
      goldStar = (<i className="yellow star icon popup" data-title="Popular tweet"/>);
    }

    return (
      <div className="content">
        {goldStar}
        <div className="header">{content.author.name}</div>
        &nbsp;
        <a href={`//twitter.com/${content.author.handle}`}>@{content.author.handle}</a>
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
            <i className="like icon" />{content.data.likes}
          </span>
          |
          <span className="retweets popup" data-title="Retweets">
            <i className="retweet icon" />{content.data.retweets}
          </span>
        </div>
      </div>
    );
  }
}

export default Feed;
