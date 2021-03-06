import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { setFeedPageNumber, setFeedPageLimit } from '../../search/searchActions';
import { TwitterProfilePicture } from '../../Twitter';

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
      <div className="ui raised purple segment">
        <div className="ui two column grid">
          <div className="column">
            <h3>Search results</h3>
          </div>
          <div className="right aligned column">
            Showing {filteredFeed.length}/{feed.length} posts
          </div>
        </div>
        <div className="ui divided items" typeof="https://schema.org/DataFeed">
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
    goldStar = (<i className="yellow star icon popup" data-title="Popular tweet" />);
  }

  let quotedContent;
  if (content.data.contains_a_quoted_tweet) {
    quotedContent = <QuotedTweet tweetId={content.data.contains_a_quoted_tweet} />;
  }

  let verifiedImage;
  if (content.author.is_verified) {
    verifiedImage = <img className="popup image" src="public/images/verified.png" alt="User is verified on Twitter." data-title="User is verified on Twitter" />;
  }

  const image_url = content.data.image_url;
  let tweetImage;
  if (image_url !== 'none') {
    tweetImage = <a href={image_url} target="_blank">
        <img className="ui bordered centered rounded image" style={{ maxHeight: '400px', width: '60%' }} src={image_url} alt={`Embedded image: ${image_url}`} />
      </a>;
  }

  // Just below we use dangerousSetInnerHTML.
  // The content it is display has come from Twitter and is safe to render as actual HTML,
  // as all HTML entities have already been encoded - e.g., instead of <script> a tweet
  // would contain &lt;script&gt;, which is totally safe to render.

  return (
    <div className="content" resource={`//twitter.com/${content.author.handle}/status/${content.data.id}`} typeof="https://schema.org/SocialMediaPosting">
      <div typeof="https://schema.org/Person" property="https://schema.org/author">
        <TwitterProfilePicture author={content.author} size="tiny" property="https://schema.org/image"/>

        {goldStar}
        <a href={`//twitter.com/${content.author.handle}`} target="_blank">
          <strong className="tweet fullname header" property="https://schema.org/name">{decodedAuthorName}</strong>
          <span style={{ color: '#A333C8' }}> @<span property="https://schema.org/alternateName">{content.author.handle}</span> {verifiedImage}</span>
        </a>
      </div>
      <br />
      <div property="https://schema.org/articleBody">
        <div dangerouslySetInnerHTML={{ __html: tweetWithLinks }} />
      </div>

      {tweetImage}
      {quotedContent}

      <div className="meta">
        <span className="date">
          <a href={`//twitter.com/${content.author.handle}/status/${content.data.id}`} property="https://schema.org/dateCreated">
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

class QuotedTweet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tweetContent: null,
    };
  }

  componentDidMount() {
    fetch(`/tweet/${this.props.tweetId}`, {})
      .then((result) => result.json())
      .then(
        (result) => {
          this.setState({
            tweetContent: {
              data: result.tweet,
              author: result.author,
            },
          });
        },
        (rej) => {
          console.warn('Unable to fetch quoted tweet.', rej);
        }
      );
  }

  render() {
    let loadingClass = 'active';
    let displayableTweetContent;

    if (this.state.tweetContent !== null) {
      displayableTweetContent = (
        <div>
          <Tweet content={this.state.tweetContent} />
        </div>
      );
      loadingClass = '';
    }

    return (
      <div>
      <div className="ui icon message">
        <i className="left quote icon popup" data-title="Quoting tweet" />
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
}
QuotedTweet.propTypes = {
  tweetId: React.PropTypes.string,
};

export default Feed;
