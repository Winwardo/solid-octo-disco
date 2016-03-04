import { BuilderDecorator } from 'js-builder-decorator';
import { schema } from './databaseSchema';

const convertSchemaObjectToClass = (name) => {
  const newObject = {};
  const schemaObject = schema[name];
  schemaObject.properties.forEach((property) => {
    newObject[property[0]] = null;
  });
  return newObject;
};

// ----------------------

export const Tweet = convertSchemaObjectToClass('Tweet');
export const TweetBuilder = BuilderDecorator.BuilderDecorator(Tweet,  { 'allFieldsMustBeSet': true });

export const Tweeter = convertSchemaObjectToClass('Tweeter');
export const TweeterBuilder = BuilderDecorator.BuilderDecorator(Tweeter,  { 'allFieldsMustBeSet': true });
