import { HIDE_MOST_USED_WORD, SHOW_MOST_USED_WORD } from './mostUsedWordsActions';

const MostUsedWordsReducer = (state = { filterTerm: '', wordsToHide: {} }, action) => {
  console.log("heyyy hide", action)
  switch (action.type) {
    case 'UPDATE_SEARCH_MOST_USED_WORDS_FILTER':
      return { ...state, filterTerm: action.filterTerm };
    case HIDE_MOST_USED_WORD:
      {
        const result = {...state};
        result.wordsToHide[action.word] = true;
        return result;
      };
    case SHOW_MOST_USED_WORD:
      {
        const result = {...state};
        delete result.wordsToHide[action.word];
        return result;
      };
    default:
      return state;
  };
};

export default MostUsedWordsReducer;
