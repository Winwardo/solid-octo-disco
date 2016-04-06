import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { setFeedPageNumber, setFeedPageLimit } from '../search/searchActions';
import { TwitterProfilePicture } from '../Twitter';
import { fetchPost, newPromiseChain } from '../../shared/utilities';

class Feed extends Component {
  componentDidMount() {
    $('.popup').popup();
  }

  componentDidUpdate() {
    $('.popup').popup();
  }

  render() {
    const {
      feed, paginationInfo,
      toggledWords, isWordsToggledActionHide,
      toggledUsers, isUsersToggledActionHide,
    } = this.props;

    const filteredFeed = filterPostsForFeed(
      feed, toggledWords, isWordsToggledActionHide,
      toggledUsers, isUsersToggledActionHide
    );
    const paginatedFeed = paginatePosts(filteredFeed, paginationInfo);

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
          {paginatedFeed.map((feedItem) => (
            <FeedItem content={feedItem} key={feedItem.data.id} />
          ))}
        </div>
        <div>
          <PaginationButtons
            numberOfPages={Math.ceil(filteredFeed.length / paginationInfo.limit)}
            paginationInfo={paginationInfo}
          />
        </div>
      </div>
    );
  }
}
Feed.propTypes = {
  feed: React.PropTypes.array,
  paginationInfo: React.PropTypes.object,
  toggledWords: React.PropTypes.array,
  isWordsToggledActionHide: React.PropTypes.bool,
  toggledUsers: React.PropTypes.array,
  isUsersToggledActionHide: React.PropTypes.bool,
};

const filterPostsForFeed = (
  feed, toggledWords, isWordsToggledActionHide, toggledUsers, isUsersToggledActionHide
) => (
  feed.filter((feedItem) => {
    const content = feedItem.data.content;
    const authorId = feedItem.author.id;

    // If we can find the chosen hidden word in this tweet, block the post
    for (const toggledWord of toggledWords) {
      if (content.indexOf(toggledWord) > -1) {
        return !isWordsToggledActionHide && isUsersToggledActionHide;
      }
    }

    for (const toggledUser of toggledUsers) {
      if (authorId === toggledUser) {
        return !isUsersToggledActionHide && isWordsToggledActionHide;
      }
    }

    return isWordsToggledActionHide && isUsersToggledActionHide;
  }
));

const paginatePosts = (feed, paginationInfo) => {
  const pageNumber = paginationInfo.number;
  const pageLimit = paginationInfo.limit;

  const first = (pageNumber - 1) * pageLimit;
  const last = first + pageLimit;

  return feed.slice(first, last);
};

let PaginationButtons = ({ dispatch, numberOfPages, paginationInfo }) => (
  <div className="ui grid">
    <div className="two column row">
      <div className="left column">
        <LimitButtons
          paginationInfo={paginationInfo}
          updateLimit={(limit) => { dispatch(setFeedPageLimit(limit)); }} /> results per page.
      </div>
      <br />
      <div className="right aligned column">
        <PagePicker
          numberOfPages={numberOfPages}
          paginationInfo={paginationInfo}
          updatePageNumber={(limit) => { dispatch(setFeedPageNumber(limit)); }}
        />
      </div>
    </div>
  </div>
);
PaginationButtons = connect()(PaginationButtons);

const LimitButtons = ({ updateLimit, paginationInfo }) => (
  <div className="ui buttons">
    <LimitButton limit={10} paginationInfo={paginationInfo} updateLimit={updateLimit} />
    <LimitButton limit={25} paginationInfo={paginationInfo} updateLimit={updateLimit} />
    <LimitButton limit={50} paginationInfo={paginationInfo} updateLimit={updateLimit} />
  </div>
);

const PagePicker = ({ updatePageNumber, numberOfPages, paginationInfo }) => (
  <div className="ui right labeled input">
    <div className="ui label">Page</div>
    <input type="number"
      placeholder="Page number..."
      onChange={(e) => {
        const value = Math.min(e.target.value, numberOfPages);
        if (value !== '' && !isNaN(parseFloat(value)) && isFinite(value)) {
          e.target.value = value;
          updatePageNumber(value);
        }
      }}
      defaultValue={paginationInfo.number}
    />
    <div className="ui label">
      / {numberOfPages}
    </div>
  </div>
);

const LimitButton = ({ updateLimit, limit, paginationInfo }) => {
  const active = limit === paginationInfo.limit;
  return (
    <button
      className={`ui ${active ? 'blue' : ''} button`}
      onClick={() => {
        updateLimit(limit);
      }}>
      {limit}
    </button>
  );
};

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

  let quotedContent;
  if (content.data.contains_a_quoted_tweet) {
    quotedContent = <QuotedTweet parentId={content.data.id}/>;
  }

  // Just below we use dangerousSetInnerHTML.
  // The content it is display has come from Twitter and is safe to render as actual HTML,
  // as all HTML entities have already been encoded - e.g., instead of <script> a tweet
  // would contain &lt;script&gt;, which is totally safe to render.

  return (
    <div className="content">
      <TwitterProfilePicture author={content.author} size="tiny" />

      {goldStar}
      <a href={`//twitter.com/${content.author.handle}`} target="_blank">
        <strong className="tweet fullname header">{decodedAuthorName}</strong>
        &nbsp;
        <span className="tweet handle">@{content.author.handle}</span>
      </a>
      <br />
      <div dangerouslySetInnerHTML={{ __html: tweetWithLinks }} />

      {quotedContent}

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

const QuotedTweet = React.createClass({
  getInitialState: () => ({
    tweetContent: null
  }),

  componentDidMount: function () {
    //this.setState({
    //  tweetContent: {
    //    data: {
    //      content: "Hey there",
    //      likes: 7,
    //      retweets: 2,
    //      date: 0,
    //    },
    //    author: {
    //      name: "Name",
    //      handle: "John",
    //      profile_image_url: "",
    //    }
    //  }
    //})
    fetch('/tweet/quotedby/' + this.props.parentId, {})
      .then((result) => result.json())
    .then((result) => {
      console.log("Donennenene", result);

      const trans = {
        data: result.tweet,
        author: result.author,
      };

      console.log(trans);


      this.setState({tweetContent: trans});
    }, (rej) => {
      console.log("Aww fetch poops", rej);
    });
  },

  render: function () {
    let loadingClass = 'active';
    let displayableTweetContent;

    if (this.state.tweetContent !== null) {
      displayableTweetContent = (
        <div>
          <Tweet content={this.state.tweetContent} />
        </div>
      )
      loadingClass = '';
    };

    return (
      <div>
      <div className="ui icon message">
        <i className="left quote icon popup" data-title="Quoting tweet"/>
        <div className="content">
          <div className={`ui ${loadingClass} inverted dimmer`}>
            <div className="ui small text loader">Fetching quoted tweet</div>
          </div>
          {displayableTweetContent}
        </div>
      </div>
    </div>
    );
  }
})

export default Feed;
