import { BuilderDecorator } from 'js-builder-decorator';
import { schema } from './databaseSchema';

/**
 * Given a schema object, as seen in ./databaseSchema.js, convert it into an object
 * for use in the BuilderDecorator.
 * @param name Schema object name
 * @returns {Object} e.g. {'name': null, 'age': null}
 */
const convertSchemaObjectToClass = (name) => {
  const newObject = {};
  const schemaObject = schema[name];
  schemaObject.properties.forEach((property) => {
    newObject[property[0]] = null;
  });
  return newObject;
};

/**
 * Given an object name in the databaseSchema, create a useful immutable Builder.
 * @param name e.g. 'Tweet'
 * @returns {Builder}
 */
const generateBuilder = (name) => {
  return BuilderDecorator.BuilderDecorator(convertSchemaObjectToClass(name),  { 'allFieldsMustBeSet': true });
};

// ----------------------

export const TweetBuilder = generateBuilder('Tweet');
export const TweeterBuilder = generateBuilder('Tweeter');
export const HashtagBuilder = generateBuilder('Hashtag');
