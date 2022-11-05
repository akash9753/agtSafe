'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _testUtils = require('testUtils');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _field = require('../../../field');

var _i18n = require('../../../i18n');

var i18n = _interopRequireWildcard(_i18n);

var _testUtils2 = require('../../testUtils');

var _data_utils = require('../../../utils/data_utils');

var _phone_number = require('../../../field/phone_number');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _dataFns = (0, _data_utils.dataFns)(['i18n']),
    set = _dataFns.set;

jest.mock('engine/classic');
jest.mock('field/vcode/vcode_pane', function () {
  return (0, _testUtils.mockComponent)('vcode_pane');
});
jest.mock('field/phone-number/locations', function () {
  return {
    __esModule: true,
    default: [['United Kingdom', 'UK', '+44']]
  };
});

jest.mock('connection/passwordless/index', function () {
  return {
    isEmail: jest.fn()
  };
});

var getComponent = function getComponent() {
  var VCodeScreen = require('connection/passwordless/ask_vcode').default;
  var screen = new VCodeScreen();
  return screen.render();
};

describe('AskVCode', function () {
  var lock = void 0;
  var i18nProp = void 0;

  beforeEach(function () {
    lock = _immutable2.default.fromJS({ id: '__lock-id__' });

    jest.resetModules();

    var lang = _immutable2.default.fromJS({
      passwordlessEmailCodeInstructions: 'An email with the code has been sent to %s.',
      passwordlessSMSCodeInstructions: 'An SMS with the code has been sent to %s.'
    });

    lock = set(lock, 'strings', lang);

    i18nProp = {
      str: function str(keypath) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return i18n.str(lock, keypath, args);
      }
    };
  });

  it('renders correctly when logging in with email', function () {
    require('connection/passwordless/index').isEmail.mockImplementation(function () {
      return true;
    });

    var Component = getComponent();
    var l = (0, _field.setField)(lock, 'email', 'test@user.com');

    (0, _testUtils2.expectComponent)(_react2.default.createElement(Component, { model: l, i18n: i18nProp })).toMatchSnapshot();
  });

  it('renders correctly when logging in with a phone number', function () {
    require('connection/passwordless/index').isEmail.mockImplementation(function () {
      return false;
    });

    var Component = getComponent();
    var l = (0, _phone_number.setPhoneNumber)(lock, '456 789');
    l = (0, _phone_number.initLocation)(l, 'UK');

    (0, _testUtils2.expectComponent)(_react2.default.createElement(Component, { model: l, i18n: i18nProp })).toMatchSnapshot();
  });
});
