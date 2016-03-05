import OrientDB from 'orientjs';
import { schema } from './../shared/data/databaseSchema';

// Credentials should be stored in a hidden config file, or in environment variables.
// As this is a student project, for simplicity, they will reside here.
const SERVER = OrientDB({
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: 'admin',
});
const DATABASE_NAME = 'footballers1';

/**
 * Insert a new class into the database based on some properties.
 * It will not override existing classes.
 * @param db The OrientDb instance
 * @param name The name of the new class, like 'Tweet'
 * @param superclass The superclass, usually 'V' or 'E'
 * @param properties Fields on the class, like 'name' or 'content', with their types.
 *   e.g. [['name', 'String'], ['birthday', 'Datetime']]
 */
const insertClass = (db, name, superclass, properties) => {
  db.class.create(name, superclass).then((clazz) => {
    const transformedProperties = properties.map((input) => {
      return { 'name': input[0], 'type': input[1], 'mandatory': true };
    });

    // Add the properties to the class
    clazz.property.create(transformedProperties).then(() => {
      properties.forEach((input) => {
        // Add Lucene fulltext indexes to some properties
        if (input.length >= 3) {
          db.index.create({
            'name': `${name}.${input[0]}`,
            'type': 'FULLTEXT',
            'engine': 'LUCENE',
          });
        };
      });
    });

    if (superclass === 'E') {
      clazz.property.create([
        { 'name': 'out', 'type': 'LINK' },
        { 'name': 'in', 'type': 'LINK' },
      ]).then(() => {
        db.execute(`CREATE INDEX unique_${name} ON ${name} (in, out) UNIQUE;`);
      });
    }

  });
};

/**
 * Update the database to have all the classes in a given schema.
 * @param db The OrientDb instance
 * @param schema See ./shared/data/databaseSchema.js for an example
 */
const insertClassesFromSchema = (db, schema) => {
  Object.keys(schema).forEach((name) => {
    const clazz = schema[name];
    insertClass(db, name, clazz.superclass, clazz.properties);
  });
};

/**
 * Ensure a database exists in a working format, creating a new one if it does not.
 * After ensuring it exists, set up all classes on it.
 * Not guaranteed to succeed, please check the console for results.
 * @param res The HTTP response object.
 */
export const generateDatabase = (res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });

  SERVER.list().then((dbs) => {
    let foundDb = null;

    dbs.forEach((db) => {
      if (db.name === DATABASE_NAME) {
        foundDb = db;
      };
    });

    if (foundDb === null) {
      SERVER.create(DATABASE_NAME).then((db) => {
        insertClassesFromSchema(db, schema);
        res.end(JSON.stringify(
          `Attempted to generate new database ${DATABASE_NAME} with classes.`
        ));
      });
    } else {
      insertClassesFromSchema(foundDb, schema);
      res.end(JSON.stringify(
        `Found database ${DATABASE_NAME}, attempted to add missing classes.`
      ));
    }
  });
};

export const db = SERVER.use(DATABASE_NAME);
