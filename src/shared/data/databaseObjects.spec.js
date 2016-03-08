import { should } from 'chai';
import { convertSchemaObjectToClass } from './databaseObjects'
import { schema } from './databaseSchema';

describe('#DatabaseObject', () => {
  it('should convert a schema object to raw object keys', () => {
    const exampleSchema = schema;
    const exampleClass = convertSchemaObjectToClass('Tweet', exampleSchema);

    exampleClass.should.include.keys(['id', 'content', 'date', 'likes', 'retweets']);
    exampleClass.should.not.include.keys(['some', 'other', 'keys']);
  });
})