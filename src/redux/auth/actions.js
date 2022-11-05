const actions = {
  CHECK_AUTHORIZATION: 'CHECK_AUTHORIZATION',
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGOUT: 'LOGOUT',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  PERMISSION_REFRESH: 'PERMISSION_REFRESH',
  PERMISSION_REFRESH_REQUEST: 'PERMISSION_REFRESH_REQUEST',
  checkAuthorization: () => ({ type: actions.CHECK_AUTHORIZATION }),
    login: (values) => ({
        type: actions.LOGIN_REQUEST,
        value: values,
    }),
    permissionRefresh: (values) => ({
        type: actions.PERMISSION_REFRESH_REQUEST,
        value: values,
    }),
    logout: () => ({
        type: actions.LOGOUT
    })
};
export default actions;
