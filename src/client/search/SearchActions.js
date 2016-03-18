import fetch from 'isomorphic-fetch';

export const addSearchTerm = (id, query) => {
  const searchQuery = {
    type: 'ADD_SEARCH_TERM',
    id,
    source: 'twitter',
  };

  switch (query.charAt(0)) {
    case '#':
      return addQueryParamTypes(searchQuery, query.substring(1), ['hashtag']);
    case '@':
      return addQueryParamTypes(searchQuery, query.substring(1), ['author', 'mention']);
    default:
      return addQueryParamTypes(searchQuery, query, ['author', 'hashtag', 'keyword', 'mention']);
  }
};

const addQueryParamTypes = (searchQuery, query, paramTypes) => {
  return {
    ...searchQuery,
    query,
    paramTypes,
  };
};

export function fetchStuff(stuff) {
  return function(dispatch) {
    return fetch("/search" ,{
      'method': 'post',
      'headers': {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      'body': JSON.stringify([{"query": stuff}])
    })
    .then(response=>{
      console.log(response);
      return response.json();
    })
    .then(json => {
      console.log(json);
    })
  };
};
