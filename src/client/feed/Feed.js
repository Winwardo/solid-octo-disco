import React, { Component } from 'react';
import { connect } from 'react-redux';

const Feed = ({feed}) => {
  console.log(feed);
  return (
    <div className="ui left aligned container">
      <div className="ui items">
        {
          feed.posts.map((feedItem) => {return (<FeedItem content={feedItem}/>)})
        }
      </div>
    </div>
  );
};

const FeedItem = ({content}) => {
  return (
    <div className="item">
      <div className="header">{content.author.name}</div>
      <div className="">
        {content.data.content}
      </div>
      <div className="extra">
        {content.data.date}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    feed: state.feed,
  };
};

export default connect(mapStateToProps)(Feed);
