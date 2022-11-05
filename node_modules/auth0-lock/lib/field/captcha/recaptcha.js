'use strict';

exports.__esModule = true;
exports.ReCAPTCHA = exports.isRecaptcha = undefined;

var _createRef = require('../../utils/createRef');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var noop = function noop() {};

var RECAPTCHA_V2_PROVIDER = 'recaptcha_v2';
var RECAPTCHA_ENTERPRISE_PROVIDER = 'recaptcha_enterprise';

var isRecaptcha = exports.isRecaptcha = function isRecaptcha(provider) {
  return provider === RECAPTCHA_ENTERPRISE_PROVIDER || provider === RECAPTCHA_V2_PROVIDER;
};

var getRecaptchaProvider = function getRecaptchaProvider(provider) {
  switch (provider) {
    case RECAPTCHA_V2_PROVIDER:
      return window.grecaptcha;
    case RECAPTCHA_ENTERPRISE_PROVIDER:
      return window.grecaptcha.enterprise;
  }
};

var scriptForProvider = function scriptForProvider(provider, lang, callback) {
  switch (provider) {
    case RECAPTCHA_V2_PROVIDER:
      return 'https://www.recaptcha.net/recaptcha/api.js?hl=' + lang + '&onload=' + callback;
    case RECAPTCHA_ENTERPRISE_PROVIDER:
      return 'https://www.recaptcha.net/recaptcha/enterprise.js?render=explicit&hl=' + lang + '&onload=' + callback;
  }
};

var ReCAPTCHA = exports.ReCAPTCHA = function (_React$Component) {
  _inherits(ReCAPTCHA, _React$Component);

  function ReCAPTCHA(props) {
    _classCallCheck(this, ReCAPTCHA);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.state = {};
    //this version of react doesn't have React.createRef
    _this.ref = (0, _createRef.createRef)();

    _this.changeHandler = function (value) {
      _this.setState({ value: value }, function () {
        _this.props.onChange(value);
      });
    };

    _this.expiredHandler = function () {
      var value = '';
      _this.setState({ value: value }, function () {
        _this.props.onChange(value);
        _this.props.onExpired();
      });
    };

    _this.erroredHandler = function () {
      var value = '';
      _this.setState({ value: value }, function () {
        _this.props.onChange(value);
        _this.props.onErrored();
      });
    };
    return _this;
  }

  ReCAPTCHA.loadScript = function loadScript(props) {
    var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.body;
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : noop;

    var callbackName = 'recatpchaCallback_' + Math.floor(Math.random() * 1000001);
    var scriptUrl = scriptForProvider(props.provider, props.hl, callbackName);
    var script = document.createElement('script');

    window[callbackName] = function () {
      delete window[callbackName];
      callback(null, script);
    };

    script.src = scriptUrl;
    script.async = true;
    element.appendChild(script);
  };

  ReCAPTCHA.prototype.componentWillUnmount = function componentWillUnmount() {
    if (!this.scriptNode) {
      return;
    }
    document.body.removeChild(this.scriptNode);
  };

  ReCAPTCHA.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    ReCAPTCHA.loadScript(this.props, document.body, function (err, scriptNode) {
      _this2.scriptNode = scriptNode;
      var provider = getRecaptchaProvider(_this2.props.provider);

      // if this is enterprise then we change this to window.grecaptcha.enterprise.render
      _this2.widgetId = provider.render(_this2.ref.current, {
        callback: _this2.changeHandler,
        'expired-callback': _this2.expiredHandler,
        'error-callback': _this2.erroredHandler,
        sitekey: _this2.props.sitekey
      });
    });
  };

  ReCAPTCHA.prototype.reset = function reset() {
    var provider = getRecaptchaProvider(this.props.provider);
    provider.reset(this.widgetId);
  };

  ReCAPTCHA.prototype.render = function render() {
    /*
      This is an override for the following conflicting css-rule:
       @media screen and (max-width: 480px)
      html.auth0-lock-html body > * {
          display: none;
      }
    */
    var fixInterval = setInterval(function () {
      var iframes = Array.from(document.querySelectorAll('iframe[src*="recaptcha"]'));

      var containers = iframes.map(function (iframe) {
        return iframe.parentNode.parentNode;
      }).filter(function (container) {
        return container && container.parentNode === document.body && container.style.display !== 'block';
      });

      if (containers.length === 0) {
        return;
      }

      containers.forEach(function (iframe) {
        iframe.style.display = 'block';
      });

      clearInterval(fixInterval);
    }, 300);

    return _react2.default.createElement(
      'div',
      {
        className: this.props.isValid ? 'auth0-lock-recaptcha-block' : 'auth0-lock-recaptcha-block auth0-lock-recaptcha-block-error'
      },
      _react2.default.createElement('div', { className: 'auth0-lock-recaptchav2', ref: this.ref })
    );
  };

  ReCAPTCHA.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value !== prevState.value) {
      return { value: nextProps.value };
    } else {
      return null;
    }
  };

  ReCAPTCHA.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    if (prevProps.value !== this.props.value && this.props.value === '') {
      this.reset();
    }
  };

  return ReCAPTCHA;
}(_react2.default.Component);

ReCAPTCHA.displayName = 'ReCAPTCHA';

ReCAPTCHA.propTypes = {
  provider: _propTypes2.default.string.isRequired,
  sitekey: _propTypes2.default.string.isRequired,
  onChange: _propTypes2.default.func,
  onExpired: _propTypes2.default.func,
  onErrored: _propTypes2.default.func,
  hl: _propTypes2.default.string,
  value: _propTypes2.default.string,
  isValid: _propTypes2.default.bool
};

ReCAPTCHA.defaultProps = {
  onChange: noop,
  onExpired: noop,
  onErrored: noop
};
