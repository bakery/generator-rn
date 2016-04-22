import { combineReducers } from 'redux-immutable';

import appReducer from './containers/App/reducer';
export default function createReducer() {
  return combineReducers({
    app: appReducer,
  });
}
