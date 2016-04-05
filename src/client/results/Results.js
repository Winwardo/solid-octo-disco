import React, { Component } from 'react';
import { connect } from 'react-redux';
import MapGL from 'react-map-gl';
var ScatterPlotOverlay = require('react-map-gl/src/overlays/scatterplot.react');
//require('script!mapbox-gl/dist/mapbox-gl-dev.js');
import Immutable from 'immutable';
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

  const _onChangeViewport = (newViewport) => {
    var viewport = assign({}, this.state.viewport, newViewport);
    this.setState({viewport});
  };

  return (
    <div className="ui grid">
      <div className="four wide column">
        <MostActiveUsers filterTerm={mostFrequent.users.filterTerm}
          userInfoList={feed.mostFrequentUsers}
          isUsersToggledActionHide={mostFrequent.users.isToggledActionHide}
        />
      </div>

      <div className="eight wide column">
        <InteractiveMap posts={posts}/>

        <Feed feed={posts}
          toggledWords={mostFrequent.words.toToggle}
          isWordsToggledActionHide={mostFrequent.words.isToggledActionHide}
          toggledUsers={mostFrequent.users.toToggle}
          isUsersToggledActionHide={mostFrequent.users.isToggledActionHide}
          paginationInfo={feed.paginationInfo}
        />
      </div>

      <div className="four wide column">
        <MostUsedWords filterTerm={mostFrequent.words.filterTerm}
          wordInfoList={feed.groupedMostFrequentWords}
          isWordsToggledActionHide={mostFrequent.words.isToggledActionHide}
        />
      </div>
    </div>
  );
};


var InteractiveMap = React.createClass({
//class InteractiveMap extends Component {
  getInitialState() {
    const postsWithLocations = this.props.posts.filter((post) => post.data.longitude !== 0);

    const locations = Immutable.fromJS(
      postsWithLocations
        .map((post) => [post.data.longitude, post.data.latitude])
    );

    const longitudeSum = postsWithLocations
      .reduce((prev, current) => (prev + current.data.longitude), 0);
    const latitudeSum = postsWithLocations
      .reduce((prev, current) => (prev + current.data.latitude), 0);

    const avLat = latitudeSum / postsWithLocations.length;
    const avLon = longitudeSum / postsWithLocations.length;

    console.log("avLat+avLon", avLat, avLon);

    return {
      viewport: {
        longitude: avLon,
        latitude: avLat,
        zoom: 0,
        width: 620,
        height: 370,
        startDragLngLat: null,
        isDragging: null,
      },
      mapStyle:'mapbox://styles/mapbox/basic-v8',
      locations: locations
    };
  },

  _onChangeViewport(newViewport) {
    const viewport = {...this.state.viewport, ...newViewport};
    this.setState({viewport});
  },

  render() {
    var {mapStyle, viewport} = this.state;
    //console.log(this.state)

    const postsWithLocations = this.props.posts.filter((post) => post.data.longitude !== 0);

    const locations = Immutable.fromJS(
      postsWithLocations
        .map((post) => [post.data.longitude, post.data.latitude])
    );


    return <MapGL
      onChangeViewport={this._onChangeViewport}
      mapStyle={mapStyle}
      {...viewport}
      mapboxApiAccessToken="pk.eyJ1Ijoid2lud2FyZG8iLCJhIjoiY2ltbm4zbWdlMDAzZnd4a3FoM29uZGcxciJ9.qRmwZHvFhbo9k-IqxKEwFA"
    >
      <ScatterPlotOverlay
        {...viewport}
        locations={locations}
        dotRadius={5}
        globalOpacity={1}
        compositeOperation="overlay"
        dotFill="#1FBAD6"
        renderWhileDragging={true}
      />
    </MapGL>;
  }
});

const mapStateToProps = (state) => ({
  feed: state.feed,
  mostFrequent: state.mostFrequent,
});

Results = connect(mapStateToProps)(Results);
export default Results;
