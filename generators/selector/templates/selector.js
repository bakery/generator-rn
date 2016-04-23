import { createSelector } from 'reselect';

const selectPartOfAppState = (state) => state.get('<REDUCER>')

const <%= selectorName %>Selector = () => createSelector(
  selectPartOfAppState(),
  // you can add more selector here ...
  (partOfState) => partOfState
);

export default <%= selectorName %>Selector;