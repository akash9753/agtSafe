'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _testUtils = require('testUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

jest.mock('engine/classic');

var getComponent = function getComponent() {
  var MFALoginScreen = require('connection/enterprise/quick_auth_screen').default;
  var screen = new MFALoginScreen();
  return screen.render();
};

describe('The quick auth screen', function () {
  var defaultProps = {
    i18n: {
      str: function str() {
        for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
          keys[_key] = arguments[_key];
        }

        return keys.join(',');
      },
      html: jest.fn()
    }
  };

  beforeEach(function () {
    jest.resetModules();

    var mockConnection = _immutable2.default.fromJS({
      name: 'Test',
      domains: ['test.com']
    });

    jest.mock('connection/social/index', function () {
      return {
        hasScreen: false,
        authButtonsTheme: jest.fn(function () {
          return {
            get: jest.fn()
          };
        })
      };
    });

    jest.mock('connection/enterprise', function () {
      return {
        quickAuthConnection: jest.fn(function () {
          return mockConnection;
        })
      };
    });

    jest.mock('core/index', function () {
      return {
        ui: {
          preferConnectionDisplayName: jest.fn(function () {
            return false;
          })
        }
      };
    });
  });

  it('renders the connection using the domain', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var Component;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            Component = getComponent();


            (0, _testUtils.expectComponent)(_react2.default.createElement(Component, defaultProps)).toMatchSnapshot();

          case 2:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  it('renders the connection using the display name when preferConnectionDisplayName is true', function () {
    var mockConnection = _immutable2.default.fromJS({
      name: 'Test',
      domains: ['test.com'],
      displayName: 'My Connection'
    });

    var _require = require('connection/enterprise'),
        quickAuthConnection = _require.quickAuthConnection;

    quickAuthConnection.mockReturnValue(mockConnection);

    var l = require('core/index');
    l.ui.preferConnectionDisplayName.mockReturnValue(true);

    var Component = getComponent();

    (0, _testUtils.expectComponent)(_react2.default.createElement(Component, defaultProps)).toMatchSnapshot();
  });

  it('renders the connection using the connection domain when preferConnectionDisplayName is true, but no display name available', function () {
    var mockConnection = _immutable2.default.fromJS({
      name: 'Test',
      domains: ['test.com']
    });

    var _require2 = require('connection/enterprise'),
        quickAuthConnection = _require2.quickAuthConnection;

    quickAuthConnection.mockReturnValue(mockConnection);

    var l = require('core/index');
    l.ui.preferConnectionDisplayName.mockReturnValue(true);

    var Component = getComponent();

    (0, _testUtils.expectComponent)(_react2.default.createElement(Component, defaultProps)).toMatchSnapshot();
  });

  it('renders the connection using the connection display name when preferConnectionDisplayName is true and there are no IdP domains configured', function () {
    var mockConnection = _immutable2.default.fromJS({
      name: 'Test',
      displayName: 'My Connection'
    });

    var _require3 = require('connection/enterprise'),
        quickAuthConnection = _require3.quickAuthConnection;

    quickAuthConnection.mockReturnValue(mockConnection);

    var l = require('core/index');
    l.ui.preferConnectionDisplayName.mockReturnValue(true);

    var Component = getComponent();

    (0, _testUtils.expectComponent)(_react2.default.createElement(Component, defaultProps)).toMatchSnapshot();
  });

  it('renders the connection using the connection name when there is no domain available', function () {
    var mockConnection = _immutable2.default.fromJS({
      name: 'Test'
    });

    var _require4 = require('connection/enterprise'),
        quickAuthConnection = _require4.quickAuthConnection;

    quickAuthConnection.mockReturnValue(mockConnection);

    var Component = getComponent();

    (0, _testUtils.expectComponent)(_react2.default.createElement(Component, defaultProps)).toMatchSnapshot();
  });
});
