var http = require( 'http' );
var url = require( 'url' );

var server = http.createServer( (request, response) => {
  if ( request.method === 'GET' ) {
    var queryData = url.parse( request.url, true ).query;
    response.writeHead( 200, { 'Content-Type': 'text/plain' } );

    // if parameter is provided
    if ( queryData.name ) {
      response.end( 'Hello ' + queryData.name + '\n' );
    } else {
      response.end( 'Hello World\n' );
    }
  }
} );

// Listen on port 3000, IP defaults to 127.0.0.1 (localhost)
server.listen( 3000 );
