'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _recaptcha = require('../../../field/captcha/recaptcha');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createLockMock = function createLockMock() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$provider = _ref.provider,
      provider = _ref$provider === undefined ? 'none' : _ref$provider,
      _ref$sitekey = _ref.sitekey,
      sitekey = _ref$sitekey === undefined ? '' : _ref$sitekey;

  return _immutable2.default.fromJS({
    id: '__lock-id__',
    core: {
      captcha: { provider: provider, sitekey: sitekey },
      transient: {
        ui: {
          language: 'en-US'
        }
      }
    }
  });
};

describe('Recaptcha v2', function () {
  it('should match the snapshot', function () {
    var mockLock = createLockMock({ provider: 'recaptcha_v2', sitekey: 'mySiteKey' });
    var wrapper = (0, _enzyme.shallow)(_react2.default.createElement(_recaptcha.ReCAPTCHA, { provider: 'recaptcha_v2', lock: mockLock, sitekey: 'mySiteKey' }));

    expect(wrapper).toMatchSnapshot();
  });

  describe('render', function () {
    beforeAll(function () {
      document.body.innerHTML = "<div id='renderTest'></div>";
    });
    afterAll(function () {
      document.getElementById('renderTest').remove();
    });
    it('injects the script', function () {
      _recaptcha.ReCAPTCHA.loadScript({ hl: 'en-US', provider: 'recaptcha_v2' }, document.body);
      expect(document.body.innerHTML).toContain('<div id="renderTest">');
      expect(document.body.innerHTML).toContain('<script src="https://www.recaptcha.net/recaptcha/api.js?hl=en-US');
    });
  });
});
