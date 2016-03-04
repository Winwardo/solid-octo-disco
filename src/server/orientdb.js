import OrientDB from 'orientjs';
import { schema } from './../shared/data/databaseSchema';

// Credentials should be stored in a hidden config file, or in environment variables.
// As this is a student project, for simplicity, they will reside here.
const server = OrientDB({
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: 'admin',
});

const DATABASE_NAME = 'footballers1';

const makeClass = (db, name, superclass, properties) => {
  db.class.create(name, superclass)
	.then((clazz) => {
  const transformedProperties = properties.map((input) => {
    return { 'name': input[0], 'type': input[1], 'mandatory': true };
  });

  clazz.property.create(transformedProperties);
	});
};

const makeClasses = (db) => {
  Object.keys(schema).forEach((name) => {
    const clazz = schema[name];
    makeClass(db, name, clazz.superclass, clazz.properties);
  });
};

export const generateDatabase = (res) => {
  server.list().then((dbs) => {
    let foundDb = null;

    dbs.forEach((db) => {
      if (db.name === DATABASE_NAME) {
        foundDb = db;
      };
    });

    if (foundDb === null) {
      server.create(DATABASE_NAME).then((db) => {
        makeClasses(db);
        res.end('Generated database and classes.');
      });
    } else {
      makeClasses(foundDb);
      res.end(`Found database, added missing classes.`);
    }
  });
};

export const db = server.use(DATABASE_NAME);
