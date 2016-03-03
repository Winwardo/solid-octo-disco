import OrientDB from 'orientjs';

// Credentials should be stored in a hidden config file, or in environment variables.
// As this is a student project, for simplicity, they will reside here.
const server = OrientDB({
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: 'open',
});

export const db = server.use('footballers1');
