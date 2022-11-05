'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _testUtils = require('testUtils');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _i18n = require('../../../i18n');

var i18n = _interopRequireWildcard(_i18n);

var _hrd_pane = require('../../../connection/enterprise/hrd_pane');

var _hrd_pane2 = _interopRequireDefault(_hrd_pane);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var lock = _immutable2.default.fromJS({ id: '__lock-id__' });

jest.mock('core/index');

describe('HRDPane', function () {
  var defaultProps = {
    model: lock,
    header: _react2.default.createElement('header', null),
    i18n: i18n,
    passwordInputPlaceholder: 'password',
    usernameInputPlaceholder: 'username'
  };

  beforeEach(function () {
    jest.resetAllMocks();
  });

  it('renders correctly', function () {
    (0, _testUtils.expectShallowComponent)(_react2.default.createElement(_hrd_pane2.default, defaultProps)).toMatchSnapshot();
  });

  it('renders the captcha if required', function () {
    require('core/index').captcha.mockReturnValue({
      get: function get() {
        return true;
      }
    });

    (0, _testUtils.expectShallowComponent)(_react2.default.createElement(_hrd_pane2.default, defaultProps)).toMatchSnapshot();
  });
});
