import { should } from 'chai';
import deepFreeze from 'deep-freeze';
import { updateMostUsedWordsSearch } from './mostUsedWordsActions';

describe('#MostUsedWordsActions', () => {
  it('should create a correct search for action', () => {
    updateMostUsedWordsSearch('SOME_AREA', 'filter').should.deep.equal({
        'type': 'UPDATE_SEARCH_SOME_AREA',
        'filterTerm': 'filter',
      });
  });
});
