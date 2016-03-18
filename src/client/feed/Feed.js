import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

const Feed = ({ feed }) => {
  return (
    <div>
      <h3>Search results</h3>
      <div className="ui divided items">
        {
          feed.posts.map((feedItem) => {return (<FeedItem content={feedItem}/>);})
        }
      </div>
    </div>
  );
};

const FeedItem = ({ content }) => {
  return (
    <div className="item">
      <div className="meta" style={{ minWidth: '40px', textAlign: 'center', verticalAlign: 'middle' }}>
        {
          content.source === 'twitter' ? <i className="twitter icon" /> : ''
        }
      </div>
      <div className="core">
        <div className="header">{content.author.name}</div>
        <div className="content">
          {
            content.source === 'twitter' ? <Tweet content={content} /> : ''
          }
        </div>
      </div>
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
      <div>
        {content.data.content}

        <div className="meta">
          <span className="date">
            {moment(content.data.date).calendar()}
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
