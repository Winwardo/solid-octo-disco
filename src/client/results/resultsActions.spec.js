import { should } from 'chai';
import { updateSearchFilter } from './resultsActions';

describe('#MostUsedWordsActions', () => {
  it('should create a correct search for action', () => {
    updateSearchFilter('SOME_AREA', 'filter').should.deep.equal({
      type: 'UPDATE_SEARCH_SOME_AREA',
      filterTerm: 'filter',
    });
  });
});
