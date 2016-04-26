import { takeEvery } from 'redux-saga';
import { put, call } from 'redux-saga/effects';

function* _<%= sagaName %>(action) {
  yield put({
    type: 'MESSAGE_TO_SEND',
    payload: {
    }
  });
}

export function* <%= sagaName %>() {
  yield* takeEvery('NAME_OF_THE_MESSAGE', _<%= sagaName %>);
}
