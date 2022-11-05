'use strict';

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _actions = require('../../../connection/database/actions');

var _store = require('../../../store');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var webApiMock = function webApiMock() {
  return require('core/web_api');
};
var coreActionsMock = function coreActionsMock() {
  return require('core/actions');
};
jest.mock('core/actions', function () {
  return {
    validateAndSubmit: jest.fn()
  };
});

jest.mock('core/web_api', function () {
  return {
    signUp: jest.fn()
  };
});

describe('database/actions.js', function () {
  beforeEach(function () {
    jest.resetAllMocks();
  });

  it('signUp splits root attributes correctly', function () {
    var id = 1;
    var hookRunner = jest.fn(function (str, m, context, fn) {
      return fn();
    });

    require('connection/database/index').databaseConnectionName = function () {
      return 'test-connection';
    };
    require('connection/database/index').shouldAutoLogin = function () {
      return true;
    };

    var m = _immutable2.default.fromJS({
      field: {
        email: {
          value: 'test@email.com'
        },
        password: {
          value: 'testpass'
        },
        family_name: {
          value: 'test-family-name'
        },
        given_name: {
          value: 'test-given-name'
        },
        name: {
          value: 'test-name'
        },
        nickname: {
          value: 'test-nickname'
        },
        picture: {
          value: 'test-pic'
        },
        other_prop: {
          value: 'test-other'
        }
      },
      database: {
        additionalSignUpFields: [{ name: 'family_name', storage: 'root' }, { name: 'given_name', storage: 'root' }, { name: 'name', storage: 'root' }, { name: 'nickname', storage: 'root' }, { name: 'picture', storage: 'root' }, { name: 'other_prop' }]
      },
      core: {
        hookRunner: hookRunner
      }
    });
    (0, _store.swap)(_store.setEntity, 'lock', id, m);
    (0, _actions.signUp)(id);

    var _coreActionsMock = coreActionsMock(),
        validateAndSubmitMock = _coreActionsMock.validateAndSubmit.mock;

    expect(validateAndSubmitMock.calls.length).toBe(1);
    expect(validateAndSubmitMock.calls[0][0]).toBe(id);
    expect(validateAndSubmitMock.calls[0][1]).toContain('email');
    expect(validateAndSubmitMock.calls[0][1]).toContain('password');
    validateAndSubmitMock.calls[0][2](m);

    var _webApiMock = webApiMock(),
        signUpMock = _webApiMock.signUp.mock;

    expect(signUpMock.calls.length).toBe(1);
    expect(signUpMock.calls[0][0]).toBe(id);
    expect(signUpMock.calls[0][1]).toMatchObject({
      connection: 'test-connection',
      email: 'test@email.com',
      password: 'testpass',
      autoLogin: true,
      family_name: 'test-family-name',
      given_name: 'test-given-name',
      name: 'test-name',
      nickname: 'test-nickname',
      picture: 'test-pic',
      user_metadata: {
        other_prop: 'test-other'
      }
    });
  });

  it('runs the signingUp hook on signUp', function () {
    var id = 1;

    require('connection/database/index').databaseConnectionName = function () {
      return 'test-connection';
    };
    require('connection/database/index').shouldAutoLogin = function () {
      return true;
    };

    var hookRunner = jest.fn(function (str, m, context, fn) {
      return fn();
    });

    var m = _immutable2.default.fromJS({
      field: {
        email: {
          value: 'test@email.com'
        },
        password: {
          value: 'testpass'
        }
      },
      core: {
        hookRunner: hookRunner
      }
    });

    (0, _store.swap)(_store.setEntity, 'lock', id, m);

    (0, _actions.signUp)(id);

    var _coreActionsMock2 = coreActionsMock(),
        validateAndSubmitMock = _coreActionsMock2.validateAndSubmit.mock;

    validateAndSubmitMock.calls[0][2](m);

    var _webApiMock2 = webApiMock(),
        signUpMock = _webApiMock2.signUp.mock;

    expect(hookRunner).toHaveBeenCalledTimes(1);
    expect(hookRunner).toHaveBeenCalledWith('signingUp', m, null, expect.any(Function));
    expect(signUpMock.calls.length).toBe(1);
    expect(signUpMock.calls[0][0]).toBe(id);
  });

  it('sanitizes additionalSignUp fields using dompurify', function () {
    var id = 1;
    var hookRunner = jest.fn(function (str, m, context, fn) {
      return fn();
    });

    require('connection/database/index').databaseConnectionName = function () {
      return 'test-connection';
    };
    require('connection/database/index').shouldAutoLogin = function () {
      return true;
    };

    // Test different fields using some examples from DOMPurify
    // https://github.com/cure53/DOMPurify#some-purification-samples-please
    var m = _immutable2.default.fromJS({
      field: {
        email: {
          value: 'test@email.com'
        },
        password: {
          value: 'testpass'
        },
        family_name: {
          value: 'Test <a href="https://www.google.co.uk">Fake link</a>' // HTML but not malicious
        },
        given_name: {
          value: '<img src=x onerror=alert(1)//>'
        },
        name: {
          value: '<p>abc<iframe//src=jAva&Tab;script:alert(3)>def</p>'
        },
        other_name: {
          value: '<div onclick=alert(0)><form onsubmit=alert(1)><input onfocus=alert(2) name=parentNode>123</form></div>'
        }
      },
      database: {
        additionalSignUpFields: [{ name: 'family_name', storage: 'root' }, { name: 'given_name', storage: 'root' }, { name: 'name', storage: 'root' }, { name: 'other_name' }]
      },
      core: {
        hookRunner: hookRunner
      }
    });

    (0, _store.swap)(_store.setEntity, 'lock', id, m);
    (0, _actions.signUp)(id);

    var _coreActionsMock3 = coreActionsMock(),
        validateAndSubmitMock = _coreActionsMock3.validateAndSubmit.mock;

    validateAndSubmitMock.calls[0][2](m);

    var _webApiMock3 = webApiMock(),
        signUpMock = _webApiMock3.signUp.mock;

    expect(signUpMock.calls[0][1]).toMatchObject({
      connection: 'test-connection',
      email: 'test@email.com',
      password: 'testpass',
      autoLogin: true,
      family_name: 'Test Fake link',
      given_name: '',
      name: 'abc',
      user_metadata: {
        other_name: '123'
      }
    });
  });
});
