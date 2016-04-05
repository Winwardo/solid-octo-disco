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

      <div className="eight wide column" id="scatterMapContainer">

        <Feed feed={posts}
          toggledWords={mostFrequent.words.toToggle}
          isWordsToggledActionHide={mostFrequent.words.isToggledActionHide}
          toggledUsers={mostFrequent.users.toToggle}
          isUsersToggledActionHide={mostFrequent.users.isToggledActionHide}
          paginationInfo={feed.paginationInfo}
        />

        <div id="tweetMap" style={{height: '500px', width:'100%'}} />
        <GMap posts={posts.filter((post) => post.data.longitude !== 0)} />

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


const GMap = React.createClass({
  // http://revelry.co/google-maps-react/
  map: null,
  markers: [],
  infoWindow: null,

  render: () => (
    <div />
  ),

  componentDidUpdate: function() {
    console.log("update");
    this.markerBounds = new google.maps.LatLngBounds();
    this.markers.forEach((marker) => marker.setMap(null));
    this.props.posts.forEach(this.addMarker);
    this.map.fitBounds(this.markerBounds);
  },

  componentDidMount: function() {
    this.map = this.createMap()
    this.componentDidUpdate();
  },

  createMap: function() {
    const mapOptions = {
      minZoom: 1,
      zoom: 1,
      center: new google.maps.LatLng(30, 0),
      mapTypeId: google.maps.MapTypeId.TERRAIN
    }

    console.log("map", mapOptions);
    //return new google.maps.Map(this.refs.map_canvas.getDOMNode(), mapOptions)
    return new google.maps.Map($("#tweetMap")[0], mapOptions)
  },

  addMarker: function(post) {
    console.log("marker", post);
    const pos = new google.maps.LatLng(post.data.latitude, post.data.longitude);
    const marker = new google.maps.Marker({
      position: pos,
      map: this.map,
      title: post.data.content
    })

    var infowindow = new google.maps.InfoWindow({
      content: post.data.content
    });

    marker.addListener('click', function() {
      infowindow.open(this.map, marker);
    })

    this.markers.push(marker);
    this.markerBounds.extend(pos)

    return marker;
  },

  createInfoWindow: function(marker) {
    console.log("info");
    const contentString = "<div class='InfoWindow'>I'm a Window that contains Info Yay</div>";
    const infoWindow = new google.maps.InfoWindow({
      map: this.map,
      anchor: marker,
      content: contentString
    })
    return infoWindow
  },

  handleZoomChange: () => {
  },

  handleDragEnd: () => {
  },
})


const mapStateToProps = (state) => ({
  feed: state.feed,
  mostFrequent: state.mostFrequent,
});

Results = connect(mapStateToProps)(Results);
export default Results;
