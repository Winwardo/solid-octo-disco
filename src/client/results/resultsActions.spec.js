import { should } from 'chai';
import { UPDATE_SEARCH_MOST_USED_WORDS_FILTER, updateMostUsedwordsSearch } from './resultsActions';

describe('#ResultsActions', () => {
  it('should create a correct search for action', () => {
    updateMostUsedwordsSearch('filter').should.deep.equal({
      type: UPDATE_SEARCH_MOST_USED_WORDS_FILTER,
      filterTerm: 'filter',
    });
  });
});
