'use strict';

const TwitterSearch = require('./server/twitterSearch')

const http = require('http');
const url = require('url');

const server = http.createServer((request, response) => {
  if (request.method === 'GET') {
    const queryData = url.parse(request.url, true).query;
    response.writeHead(200, { 'Content-Type': 'text/plain' });

    TwitterSearch.test();

    // if parameter is provided
    if (queryData.name) {
      response.end(`Hello ${queryData.name}`);
    } else {
      response.end('Hello World\n');
    }
  }
});

// Listen on port 3000, IP defaults to 127.0.0.1 (localhost)
server.listen(3000);
