'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _web_api = require('../../core/web_api');

var _web_api2 = _interopRequireDefault(_web_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Auth0WebApi', function () {
  var originalWindow = void 0;

  var LOCK_ID = 'lock-id';
  var CLIENT_ID = 'client-id';
  var DEFAULT_DOMAIN = 'test.com';
  var client = function client() {
    return _web_api2.default.clients[LOCK_ID];
  };

  beforeEach(function () {
    originalWindow = window.window;
  });

  afterEach(function () {
    window.window = originalWindow;
  });

  describe('setupClient', function () {
    it('sets the correct options when is on the hosted login page', function () {
      delete window.location;
      window.location = _extends({}, originalWindow.location, { host: DEFAULT_DOMAIN, search: '' });
      _web_api2.default.setupClient(LOCK_ID, CLIENT_ID, DEFAULT_DOMAIN, { redirect: true });

      expect(client()).toEqual(expect.objectContaining({
        isUniversalLogin: true,
        domain: DEFAULT_DOMAIN,
        authOpt: {
          popup: false
        }
      }));
    });

    it('sets redirect: true when on the same origin as the specified domain', function () {
      delete window.location;
      window.location = _extends({}, originalWindow.location, { host: DEFAULT_DOMAIN, search: '' });

      _web_api2.default.setupClient(LOCK_ID, CLIENT_ID, DEFAULT_DOMAIN, {});
      expect(client().authOpt.popup).toBe(false);
    });

    it('sets redirect: false when on a different origin as the specified domain', function () {
      delete window.location;
      window.location = _extends({}, originalWindow.location, { host: 'test-other.com', search: '' });

      _web_api2.default.setupClient(LOCK_ID, CLIENT_ID, DEFAULT_DOMAIN, {});
      expect(client().authOpt.popup).toBe(true);
    });

    it('forces popup and sso mode for cordova, only when not running in the hosted environment', function () {
      delete window.location;
      window.location = _extends({}, originalWindow.location, { host: DEFAULT_DOMAIN, search: '' });
      window.cordova = true;

      _web_api2.default.setupClient(LOCK_ID, CLIENT_ID, DEFAULT_DOMAIN, {});
      expect(client().authOpt.popup).toBe(false);
      expect(client().authOpt.sso).toBeUndefined();
    });

    it('forces popup and sso mode for electron, only when not running in the hosted environment', function () {
      delete window.location;
      window.location = _extends({}, originalWindow.location, { host: DEFAULT_DOMAIN, search: '' });
      window.electron = true;

      _web_api2.default.setupClient(LOCK_ID, CLIENT_ID, DEFAULT_DOMAIN, {});
      expect(client().authOpt.popup).toBe(false);
      expect(client().authOpt.sso).toBeUndefined();
    });
  });
});
