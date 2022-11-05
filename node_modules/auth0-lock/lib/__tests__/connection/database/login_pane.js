'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _testUtils = require('testUtils');

var _login_pane = require('../../../connection/database/login_pane');

var _login_pane2 = _interopRequireDefault(_login_pane);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var lock = _immutable2.default.fromJS({ id: '__lock-id__' });

jest.mock('core/index');

jest.mock('engine/classic');
jest.mock('connection/enterprise');

describe('LoginPane', function () {
  var defaultProps = {
    emailInputPlaceholder: '',
    forgotPasswordAction: '',
    i18n: {},
    passwordInputPlaceholder: '',
    showForgotPasswordLink: true,
    showPassword: true,
    usernameInputPlaceholder: '',
    lock: lock
  };

  beforeEach(function () {
    jest.resetAllMocks();
  });

  it('renders correctly', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            (0, _testUtils.expectShallowComponent)(_react2.default.createElement(_login_pane2.default, defaultProps)).toMatchSnapshot();

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  it('renders a captcha', function () {
    require('core/index').captcha.mockReturnValue({
      get: function get() {
        return true;
      }
    });

    (0, _testUtils.expectShallowComponent)(_react2.default.createElement(_login_pane2.default, defaultProps)).toMatchSnapshot();
  });

  it('hides the captcha for SSO connections', function () {
    require('core/index').captcha.mockReturnValue({
      get: function get() {
        return true;
      }
    });

    require('engine/classic').isSSOEnabled.mockReturnValue(true);

    (0, _testUtils.expectShallowComponent)(_react2.default.createElement(_login_pane2.default, defaultProps)).toMatchSnapshot();
  });

  it('shows the captcha for SSO (ADFS) connections', function () {
    require('core/index').captcha.mockReturnValue({
      get: function get() {
        return true;
      }
    });

    require('engine/classic').isSSOEnabled.mockReturnValue(true);
    require('connection/enterprise').isHRDDomain.mockReturnValue(true);

    (0, _testUtils.expectShallowComponent)(_react2.default.createElement(_login_pane2.default, defaultProps)).toMatchSnapshot();
  });
});
