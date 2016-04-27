import { combineReducers } from 'redux-immutable';

export default function createReducer() {
  return combineReducers({
    // XX: removes this once you start adding containers with reducers
    dummyReducer: (state = {}) => state
  });
}
