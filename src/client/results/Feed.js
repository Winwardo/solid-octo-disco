import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { setFeedPageNumber, setFeedPageLimit } from '../search/searchActions';

class Feed extends Component {
  componentDidMount() {
    $('.popup').popup();
  }

  componentDidUpdate() {
    $('.popup').popup();
  }

  render() {
    const {feed, hiddenWords, hiddenUsers, paginationInfo} = this.props;

    const filteredFeed = filterPostsForFeed(feed, hiddenWords, hiddenUsers);
    const paginatedFeed = paginatePosts(feed, paginationInfo);

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
        <div>
          <PaginationButtons amount={Math.ceil(filteredFeed.length / paginationInfo.limit)} paginationInfo={paginationInfo}/>
        </div>
        <div className="ui divided items">
          {paginatedFeed.map((feedItem) => (<FeedItem content={feedItem}/>))}
        </div>
      </div>
    );
  }
};

Feed.propTypes = {
  feed: React.PropTypes.array,
  paginationInfo: React.PropTypes.object,
  hiddenWords: React.PropTypes.array,
  hiddenUsers: React.PropTypes.array,
};

let PaginationButtons = ({dispatch, amount, paginationInfo}) => {
  return (
    <div>
      <LimitButtons paginationInfo={paginationInfo}/> results per page.
      <br />
      <PagePicker amount={amount} paginationInfo={paginationInfo} />
    </div>
  )
};
PaginationButtons = connect()(PaginationButtons);

const LimitButtons = ({paginationInfo}) => (
  <div className="ui buttons">
    <LimitButton limit={10} paginationInfo={paginationInfo} />
    <LimitButton limit={25} paginationInfo={paginationInfo} />
    <LimitButton limit={50} paginationInfo={paginationInfo} />
  </div>
)

let PagePicker = ({dispatch, amount, paginationInfo}) => (
  <div className="ui right labeled input">
    <div className="ui label">Page</div>
    <input type="number"
      placeholder="Page number..."
      onChange={(e) => {
        const value = e.target.value;
        if (!isNaN(parseFloat(value)) && isFinite(value)) {
          dispatch(setFeedPageNumber(e.target.value));
        }
      }}
      min={1}
      max={amount}
      value={paginationInfo.number}
    />
    <div className="ui label">
      / {amount}
    </div>
  </div>
)
PagePicker = connect()(PagePicker);

let LimitButton = ({dispatch, limit, paginationInfo}) => {
  const active = limit === paginationInfo.limit;
  return (
    <button
      className={`ui ${active ? 'blue' : ''} button`}
      onClick={() => {
      dispatch(setFeedPageLimit(limit))
      }}>
      {limit}
    </button>
  );
};
LimitButton = connect()(LimitButton);

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

const paginatePosts = (feed, paginationInfo) => {
  const pageNumber = paginationInfo.number;
  const pageLimit = paginationInfo.limit;

  const first = (pageNumber-1) * pageLimit;
  const last = first + pageLimit;

  return feed.slice(first, last);
}

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

const Tweet = ({ content }) => {
  // Inject HTML <a> tags around any Twitter approved t.co link
  const tweetWithLinks = content.data.content.replace(/(https\:\/\/t\.co\/.+?)\b/g, '<a href="$1">$1</a>');
  const decodedAuthorName = content.author.name;

  let goldStar;
  if (content.data.likes + content.data.retweets > 10) {
    goldStar = (<i className="yellow star icon popup" data-title="Popular tweet"/>);
  }

  // Just below we use dangerousSetInnerHTML.
  // The content it is display has come from Twitter and is safe to render as actual HTML,
  // as all HTML entities have already been encoded - e.g., instead of <script> a tweet
  // would contain &lt;script&gt;, which is totally safe to render.

  return (
    <div className="content">
      {goldStar}
      <a href={`//twitter.com/${content.author.handle}`} target="_blank">
        <strong className="tweet fullname header">{decodedAuthorName}</strong>
        &nbsp;
        <span className="tweet handle">@{content.author.handle}</span>
      </a>
      <br />
      <div dangerouslySetInnerHTML={{__html: tweetWithLinks}} />

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
};

export default Feed;
