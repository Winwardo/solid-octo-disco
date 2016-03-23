import { HIDE_MOST_USED_WORD, SHOW_MOST_USED_WORD } from './mostUsedWordsActions';

const MostUsedWordsReducer = (state = { filterTerm: '', wordsToHide: {} }, action) => {
  switch (action.type) {
    case 'UPDATE_SEARCH_MOST_USED_WORDS_FILTER':
      return { ...state, filterTerm: action.filterTerm };
    case HIDE_MOST_USED_WORD:
      {
        const result = { ...state, wordsToHide: Object.assign({}, state.wordsToHide) };
        result.wordsToHide[action.word] = true;
        return result;
      }
    case SHOW_MOST_USED_WORD:
      {
        const result = { ...state, wordsToHide: Object.assign({}, state.wordsToHide) };
        delete result.wordsToHide[action.word];
        return result;
      }
    default:
      return state;
  };
};

export default MostUsedWordsReducer;
