'use strict';

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _actions = require('../../../connection/enterprise/actions');

var _index = require('../../../core/index');

var l = _interopRequireWildcard(_index);

var _index2 = require('../../../field/index');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

jest.mock('connection/database/index', function () {
  return {
    databaseLogInWithEmail: jest.fn(function () {
      return true;
    }),
    databaseUsernameValue: jest.fn()
  };
});

jest.mock('store/index', function () {
  return {
    read: jest.fn(function () {
      return 'model';
    }),
    getEntity: 'getEntity',
    swap: jest.fn(),
    updateEntity: 'updateEntity'
  };
});

jest.mock('connection/enterprise', function () {
  return {
    matchConnection: jest.fn(),
    enterpriseActiveFlowConnection: jest.fn(),
    isHRDActive: jest.fn(),
    isEnterpriseDomain: jest.fn()
  };
});

jest.mock('core/actions', function () {
  return {
    logIn: jest.fn()
  };
});

describe('Login with connection scopes', function () {
  var lock = void 0;

  beforeEach(function () {
    lock = _immutable2.default.fromJS({ id: '__lock__' });
    require('store/index').read.mockReturnValue(lock);
  });

  afterEach(function () {
    jest.resetAllMocks();
  });

  describe('for an SSO connection', function () {
    it('passes connectionScopes to the connection', function () {
      lock = l.setup('__lock__', 'client', 'domain', {
        auth: {
          connectionScopes: {
            'sso-connection': ['offline_access']
          }
        }
      });

      lock = (0, _index2.setField)(lock, 'email', 'test@test.com');

      require('store/index').read.mockReturnValue(lock);

      require('connection/enterprise').matchConnection.mockReturnValue(_immutable2.default.fromJS({ name: 'sso-connection' }));

      var coreActions = require('core/actions');

      (0, _actions.logIn)('__lock__');

      expect(coreActions.logIn).toHaveBeenCalledWith('__lock__', ['email'], {
        connection_scope: ['offline_access'],
        connection: 'sso-connection',
        login_hint: 'test@test.com'
      });
    });

    it('should not throw an error if the captcha was not completed', function () {
      lock = l.setup('__lock__', 'client', 'domain', {});
      lock = (0, _index2.setField)(lock, 'email', 'test@test.com');

      // This will be specified in the response from the /challenge endpoint if the
      // dashboard settings have Captcha as 'required', regardless of connection being used.
      lock = l.setCaptcha(lock, {
        required: true,
        provider: 'recaptcha_v2'
      });

      require('store/index').read.mockReturnValue(lock);

      require('connection/enterprise').matchConnection.mockReturnValue(_immutable2.default.fromJS({ name: 'sso-connection' }));

      var coreActions = require('core/actions');

      (0, _actions.logIn)('__lock__');
      expect(coreActions.logIn).toHaveBeenCalled();
    });
  });

  describe('for a non-SSO connection', function () {
    it('passes connectionScopes to the connection', function () {
      lock = l.setup('__lock__', 'client', 'domain', {
        auth: {
          connectionScopes: {
            'enterprise-connection': ['offline_access']
          }
        }
      });

      lock = (0, _index2.setField)(lock, 'password', 'test');
      lock = (0, _index2.setField)(lock, 'username', 'test');

      require('store/index').read.mockReturnValue(lock);

      require('connection/enterprise').enterpriseActiveFlowConnection.mockReturnValue(_immutable2.default.fromJS({ name: 'enterprise-connection' }));

      var coreActions = require('core/actions');

      (0, _actions.logIn)('__lock__');

      expect(coreActions.logIn).toHaveBeenCalledWith('__lock__', ['password', 'username'], {
        connection_scope: ['offline_access'],
        connection: 'enterprise-connection',
        username: 'test',
        password: 'test',
        login_hint: 'test'
      }, expect.any(Function));
    });
  });
});
