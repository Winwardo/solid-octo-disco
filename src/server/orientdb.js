import OrientDB from 'orientjs';
import { schema } from './../shared/data/databaseSchema';
import { newPromiseChain } from '../shared/utilities';

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
 * @param classSchema The schema of the class
 */
const insertClass = (db, name, classSchema) => {
  const superclass = classSchema.superclass;
  const properties = classSchema.properties;

  return newPromiseChain()
  .then(() => db.class.create(name, superclass))
  .then((clazz) => createClassProperties(clazz, properties))
  .then(() => (
    // Add indexes
    Promise.all(classSchema.indexes.map((index) => {
      const defaults = {
       'name': `${name}.${index.properties.join('_')}`,
       'class': name,
      };
      const indexToInsert = { ...defaults, ...index };

      return db.index.create(indexToInsert);
    }))
  ))
  .then(() => console.log(`Successfully generated class ${name}.`))
  .catch((error) => console.warn(`Error: Unable to generate class ${name};`, error.message));
};

/**
 * Add the properties to the db class
 * @param class The db OrientDb class
 * @param properties The class paramater's properties
 */
const createClassProperties = (clazz, properties) => {
  const transformedProperties = properties.map((input) => (
    { ...input, 'mandatory': true }
  ));

  // Add the properties to the class
  return clazz.property.create(transformedProperties);
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
