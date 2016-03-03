import http from 'http';
import url from 'url';

const port = process.env.PORT || 3000;

const server = http.createServer((request, response) => {
  if (request.method === 'GET') {
    const queryData = url.parse(request.url, true).query;
    response.writeHead(200, { 'Content-Type': 'text/plain' });

    // if parameter is provided
    if (queryData.name) {
      response.end(`Hello ${queryData.name}`);
    } else {
      response.end('Hello World\n');
    }
  }
});

// Listen on port 3000, IP defaults to 127.0.0.1 (localhost)
server.listen(port, () => {
  console.log('Server running at http://localhost: ' + port);
});
