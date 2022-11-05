import { Map } from 'immutable';
import actions from './actions';
import { getToken } from '../../helpers/utility';

const initState = new Map({
    idToken: null,
    permissions: []
});

export default function authReducer(state = initState.merge(getToken()), action) {
  switch (action.type) {
    case actions.LOGIN_SUCCESS:
      return state
              .set('idToken', action.token)
          .set('permissions', action.permissions);
     case actions.PERMISSION_REFRESH:
          return state
            .set('idToken', sessionStorage.getItem("id_token"))
            .set('permissions', action.permissions);
    case actions.LOGOUT:
      return initState;
    default:
      return state;
  }
}
