import { all, takeEvery, put, fork } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { getToken, clearToken } from '../../helpers/utility';
import actions from './actions';

var isLoginSuccess = false;

export function* loginRequest() {
    yield takeEvery('LOGIN_REQUEST', function* (payload) {
      isLoginSuccess = payload.value.success;
      if (isLoginSuccess) {
      yield put({
        type: actions.LOGIN_SUCCESS,
        token: payload.value.idToken,
        profile: payload.value.profile,
        permissions: payload.value.permissions,
      });
    } else {
      yield put({ type: actions.LOGIN_ERROR });
    }
  });
}

export function* loginSuccess() {
  yield takeEvery(actions.LOGIN_SUCCESS, function*(payload) {
      yield sessionStorage.setItem('id_token', payload.token);
      yield sessionStorage.setItem('permissions', JSON.stringify(payload.permissions));
  });
}

export function* permissionRefreshRequest() {
    yield takeEvery('PERMISSION_REFRESH_REQUEST', function* (payload) {
        
        yield put({
            type: actions.PERMISSION_REFRESH,
            token: payload.value.idToken,
            permissions: payload.value.permissions
        });
    });
}

export function* permissionRefresh() {

    yield takeEvery(actions.PERMISSION_REFRESH, function* (payload) {
        const values = getToken();
        yield sessionStorage.setItem('id_token', values.idToken);
        yield sessionStorage.setItem('permissions', JSON.stringify(payload.permissions));
    });
}

export function* loginError() {
  yield takeEvery(actions.LOGIN_ERROR, function*() {});
}

export function* logout() {
  yield takeEvery(actions.LOGOUT, function*() {
    clearToken();
    yield put(push('/'));
  });
}
export function* checkAuthorization() {
  yield takeEvery(actions.CHECK_AUTHORIZATION, function*() {
      const values = getToken();
      if (values.idToken) {
      yield put({
        type: actions.LOGIN_SUCCESS,
        token: values.idToken,
        permissions: values.permissions
      });
    }
  });
}
export default function* rootSaga() {
  yield all([
    fork(checkAuthorization),
    fork(loginRequest),
    fork(loginSuccess),
    fork(loginError),
    fork(permissionRefreshRequest),
    fork(permissionRefresh),
    fork(logout)
  ]);
}
