'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _testUtils = require('testUtils');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _data_utils = require('../../../utils/data_utils');

var _i18n = require('../../../i18n');

var i18n = _interopRequireWildcard(_i18n);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _dataFns = (0, _data_utils.dataFns)(['i18n']),
    set = _dataFns.set;

jest.mock('engine/classic');
jest.mock('connection/enterprise/hrd_pane', function () {
  return (0, _testUtils.mockComponent)('hrd_pane');
});
jest.mock('connection/enterprise', function () {
  return {
    enterpriseDomain: jest.fn(function () {
      return 'domain.com';
    })
  };
});

var getComponent = function getComponent() {
  var HRDScreen = require('connection/enterprise/hrd_screen').default;
  var screen = new HRDScreen();
  return screen.render();
};

describe('HRDScreen Component', function () {
  var i18nProp = void 0;
  var lock = void 0;

  beforeEach(function () {
    lock = _immutable2.default.fromJS({ id: '__lock-id__' });

    jest.resetModules();

    var lang = _immutable2.default.fromJS({
      enterpriseLoginIntructions: 'Login with your corporate credentials.',
      enterpriseActiveLoginInstructions: 'Please enter your corporate credentials at %s.'
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

  it('renders correctly when there is an enterprise domain', function () {
    var Component = getComponent();
    (0, _testUtils.expectComponent)(_react2.default.createElement(Component, { model: lock, i18n: i18nProp })).toMatchSnapshot();
  });

  it('renders correctly when there is no enterprise domain', function () {
    require('connection/enterprise').enterpriseDomain.mockImplementation(function () {
      return null;
    });
    var Component = getComponent();
    (0, _testUtils.expectComponent)(_react2.default.createElement(Component, { model: lock, i18n: i18nProp })).toMatchSnapshot();
  });
});
