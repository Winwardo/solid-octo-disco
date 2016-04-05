import React, { Component } from 'react';

export default React.createClass({
  // Inspired by http://revelry.co/google-maps-react/
  render: () => (
    <div />
  ),

  componentDidUpdate: function() {
    this.markerBounds = new google.maps.LatLngBounds();
    this.markerBounds.extend(new google.maps.LatLng(51.5, 0.12)) // London

    this.markers.forEach((marker) => marker.setMap(null));
    this.props.posts.forEach(this.addMarker);

    // Fit the zoom of the map to show all of the marked tweets, and no more.
    this.map.fitBounds(this.markerBounds);
  },

  componentDidMount: function() {
    this.markers = [];
    this.map = this.createMap();

    this.componentDidUpdate();
  },

  createMap: function() {
    const mapOptions = {
      minZoom: 1,
      zoom: 1,
      center: new google.maps.LatLng(0, 0),
      mapTypeId: google.maps.MapTypeId.TERRAIN
    }

    return new google.maps.Map($("#tweetMap")[0], mapOptions);
  },

  addMarker: function(post) {
    const pos = new google.maps.LatLng(post.data.latitude, post.data.longitude);

    const marker = new google.maps.Marker({
      position: pos,
      map: this.map,
      title: post.data.content
    });

    const infowindow = new google.maps.InfoWindow({
      content: `<a href="//twitter.com/${post.author.handle}">@${post.author.handle}</a>: ${post.data.content}`
    });

    marker.addListener('click', function() {
      infowindow.open(this.map, marker);
    })

    this.markers.push(marker);
    this.markerBounds.extend(pos)

    return marker;
  },
});