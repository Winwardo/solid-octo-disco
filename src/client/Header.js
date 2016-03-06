import React, { Component } from 'react';

const Header = () => {
  return (
  <div className="ui three item menu borderless">
		<h1 className="item">
			Socto
			<i className="icon-thumbs-ok"></i>
		</h1>

		<a className="item">
			<i className="huge help circle icon"></i>
			logo placeholder
		</a>

		<div className="item">
			<div className="ui buttons">
				<button className="ui button">Join</button>
				<div className="or"></div>
				<button className="ui button">Log In</button>
			</div>
		</div>
	</div>
  );
};

export default Header;
