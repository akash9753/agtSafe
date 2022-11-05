'use strict';

var _actions = require('../../core/actions');

var _testUtils = require('testUtils');

var _index = require('core/index');

var l = _interopRequireWildcard(_index);

var _index2 = require('store/index');

var _web_api = require('../../core/web_api');

var _web_api2 = _interopRequireDefault(_web_api);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

jest.mock('../../core/web_api', function () {
  return {
    __esModule: true,
    default: {
      logIn: jest.fn(),
      checkSession: jest.fn()
    }
  };
});

jest.mock('store/index', function () {
  var _ref;

  return _ref = {
    read: jest.fn(function () {
      return 'model';
    }),
    getEntity: 'getEntity',
    swap: jest.fn(),
    updateEntity: 'updateEntity'
  }, _ref['read'] = jest.fn(), _ref;
});

jest.mock('core/index');

describe('core.actions', function () {
  beforeEach(function () {
    jest.resetAllMocks();

    l.submitting.mockReturnValue(true);
    l.id.mockReturnValue('id');
    l.auth.params.mockReturnValue((0, _immutable.fromJS)({}));
  });

  describe('checkSession', function () {
    it('should set submitting on start', function () {
      (0, _actions.checkSession)('id', 'params', 'cb');

      var _require = require('store/index'),
          read = _require.read,
          swap = _require.swap;

      (0, _testUtils.expectMockToMatch)(read, 1);
      (0, _testUtils.expectMockToMatch)(swap, 1);
      swap.mock.calls[0][3]('model');
      (0, _testUtils.expectMockToMatch)(require('core/index').setSubmitting, 1);
    });
  });

  describe('logIn', function () {
    it('run the loggingIn hook', function (done) {
      var m = {};
      _index2.read.mockReturnValue(m);

      _web_api2.default.logIn.mockImplementation(function (id, params, authParams, cb) {
        cb(null, {});
        done();
      });

      l.runHook.mockImplementation(function (m, hook, context, fn) {
        expect(hook).toEqual('loggingIn');
        fn();
      });

      (0, _actions.logIn)();
    });

    it('should display an error if one was thrown from the hook', function (done) {
      var m = {};
      _index2.read.mockReturnValue(m);

      var store = require('store/index');

      store.swap.mockImplementation(function (entity, n, id, fn, value, error) {
        if (error) {
          expect(error).toEqual('This is a hook error');
          done();
        }
      });

      l.loginErrorMessage.mockImplementation(function (m, error) {
        return error.description;
      });

      l.runHook.mockImplementation(function (m, hook, fn) {
        expect(hook).toEqual('loggingIn');
        throw { code: 'hook_error', description: 'This is a hook error' };
      });

      (0, _actions.logIn)();
    });
  });
});
