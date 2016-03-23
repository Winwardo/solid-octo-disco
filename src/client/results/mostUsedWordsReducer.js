import { TOGGLE_MOST_USED_WORD } from './mostUsedWordsActions';

const MostUsedWordsReducer = (state = { filterTerm: '', wordsToHide: [] }, action) => {
  switch (action.type) {
    case 'UPDATE_SEARCH_MOST_USED_WORDS_FILTER':
      return { ...state, filterTerm: action.filterTerm };
    case TOGGLE_MOST_USED_WORD:
    {
      const termIndex = state.wordsToHide.indexOf(action.word);
      if (termIndex > -1) {
        let newWordsToHide = [
          ...state.wordsToHide.slice(0, termIndex),
          ...state.wordsToHide.slice(termIndex + 1),
        ];

        return {
          ...state,
          wordsToHide: newWordsToHide,
        };
      }else {
        return {
          ...state,
          wordsToHide: [...state.wordsToHide, action.word]
        }
      }
    }
    default:
      return state;
  };
};

export default MostUsedWordsReducer;
