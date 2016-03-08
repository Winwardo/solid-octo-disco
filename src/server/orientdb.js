import OrientDB from 'orientjs';
import { schema } from './../shared/data/databaseSchema';
import { chainPromises } from '../shared/utilities';

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
const insertClass = (db, name, data) => {
  const superclass = data.superclass;
  const properties = data.properties;

  return chainPromises(() => {
    return db.class.create(name, superclass);
  }).then((clazz) => {

    const transformedProperties = properties.map((input) => {
      return { ...input, 'mandatory': true };
    });

    console.log(transformedProperties);

    // Add the properties to the class
    return clazz.property.create(transformedProperties);
  }).then(() => {
    // Add indexes
    return Promise.all(data.indexes.map((index) => {
      console.log('a');

      const defaults = {
        'name': `${name}.${index.properties.join('_')}`,
        'class': name,
      };

      console.log('b');
      const indexToInsert = { ...defaults, ...index };
      console.log('c');

      console.log(defaults);
      console.log(indexToInsert);

      return db.index.create(indexToInsert);
    }));

    //return Promise.all(properties.map((input) => {
    //  // Add Lucene fulltext indexes to some properties
    //  if (input.index !== 'none') {
    //    return db.index.create({
    //        'name': `${name}.${input.name}`,
    //        'type': input.index,
    //        'class': name,
    //        'properties': input.name,
    //      });
    //  };
    //}));
  }).then(() => {
    //if (superclass === 'E') {
    //  return chainPromises(() => {
    //    return clazz.property.create([
    //      { 'name': 'out', 'type': 'LINK' },
    //      { 'name': 'in', 'type': 'LINK' },
    //    ]);
    //  }).then(() => {
    //    return db.index.create({
    //        'name': `${name}.unique`,
    //        'class': name,
    //        'properties': ['in', 'out'],
    //        'type': 'UNIQUE',
    //      });
    //  });
    //}
  }).catch((error) => {
    console.warn(`Error: Unable to generate class ${name};`, error.message);
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
    insertClass(db, name, clazz);
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
