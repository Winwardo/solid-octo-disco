import React, { Component } from 'react';
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import { addSearchTerm } from './SearchActions';

let nextSearchTermId = 0;

const Search = () => {
	return(
		<div className="ui left aligned container">
			<Current />
			<Filters />
		</div>
	);
};

let Current = ({ dispatch }) => {
	let showSearchkeyword = false;
	let searchKeyword;
	let searchKeywordContainer;
	return(
		<div className="row ui raised segment">
			<div style={{cursor: 'text'}} onClick={() => {
				showSearchkeyword = !showSearchkeyword;
				if(showSearchkeyword) {
					$("#searchKeywordContainer").slideDown("fast", () => {
						searchKeyword.focus();
					});
				}
			}}>
				<i className="icon search"></i>

				<div id="searchKeywordContainer" className="ui fluid big transparent input" 
					style={{
						display:'none', 
						paddingLeft:20,
						paddingTop:10,
						marginTop:10,
						borderTop:1,
						borderTop: '2px dashed #D3D5D8'
				}}>
					<input id="searchKeyword" type="text" placeholder="Search a keyword or hashtag" 
						ref={(node) => {
							searchKeyword = node;
						}}
						onBlur={() => {
							$("#searchKeywordContainer").slideUp("fast", () => {
								showSearchkeyword = false;
							});
						}}
						onKeyDown={(e) => {
							if(e.keyCode == 13) {
								dispatch(batchActions(addSearchTerm(nextSearchTermId++, searchKeyword.value)))
								searchKeyword.value = '';
							}
						}}/>
					<i className="link remove circle icon"></i>
				</div>
			</div>
			
			{/* action buttons (ie save filter)*/}
			<div>
			</div>
		</div>
	);
};
Current = connect()(Current);

const Filters = () => {
	return(
		<div className="row">
			Content
		</div>
	);
};

export default Search;