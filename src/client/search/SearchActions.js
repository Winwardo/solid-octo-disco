export const addSearchTerm = (id, query) => {
	const searchQuery = {
		type: 'ADD_SEARCH_TERM',
		id,
		query,
		source: 'twitter'
	}

	switch(query.startWith) {
		case '#':
			return [addQueryParamType(searchQuery, 'hashtag')];
		case '@':
			return [
				addQueryParamType(searchQuery, 'author'),
				addQueryParamType(searchQuery, 'mention')
			];  
		default:
			return [
				addQueryParamType(searchQuery, 'author'),
				addQueryParamType(searchQuery, 'hashtag'),
				addQueryParamType(searchQuery, 'mention'),
				addQueryParamType(searchQuery, 'keyword')
			];
	}
}

const addQueryParamType = (query, paramType) => {
	return {
		...query,
		paramType
	}
}