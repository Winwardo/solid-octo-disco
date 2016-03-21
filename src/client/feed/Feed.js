import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

const Feed = ({ feed }) => (
  <div>
    <h3>Search results</h3>
    <div className="ui divided items">
      {
        feed.map((feedItem) => (<FeedItem content={feedItem}/>))
      }
    </div>
  </div>
);

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

class Tweet extends Component {
  componentDidMount() {
    $('.popup').popup();
  }

  render() {
    const content = this.props.content;
    return (
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
  }
}

const mapStateToProps = (state) => {
  return {
    feed: state.feed,
  };
};

export default connect(mapStateToProps)(Feed);