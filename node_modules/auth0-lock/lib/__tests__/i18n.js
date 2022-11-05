'use strict';

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _flat = require('flat');

var _flat2 = _interopRequireDefault(_flat);

var _en = require('../i18n/en');

var _en2 = _interopRequireDefault(_en);

var _es = require('../i18n/es');

var _es2 = _interopRequireDefault(_es);

var _sync = require('../sync');

var sync = _interopRequireWildcard(_sync);

var _index = require('../core/index');

var l = _interopRequireWildcard(_index);

var _sanitizer = require('../sanitizer');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('i18n', function () {
  var syncSpy = void 0;
  var langSpy = void 0;

  beforeEach(function () {
    syncSpy = jest.spyOn(sync, 'default');

    langSpy = jest.spyOn(l.ui, 'language').mockImplementation(function () {
      return 'en';
    });
  });

  afterEach(function () {
    syncSpy.mockRestore();
    langSpy.mockRestore();
  });

  describe('load i18n configuration', function () {
    it('should have a defaultDictionary', function () {
      var i18n = require('../i18n');

      // We need to initialize the state
      var m = _immutable2.default.fromJS({});

      // Initialize i18n.
      var initialized = i18n.initI18n(m);

      var language = (0, _flat2.default)(initialized.getIn(['i18n', 'strings']).toJS());
      var en = (0, _flat2.default)(_en2.default);

      expect(language).toEqual(en);
    });
  });

  describe('when en language is selected', function () {
    it('should allow check for external en dictionaries', function () {
      var i18n = require('../i18n');

      i18n.initI18n(_immutable2.default.fromJS({}));
      expect(syncSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('when html is called', function () {
    it('should sanitize the input and not allow for javascript to be passed through', function () {
      var i18n = require('../i18n');
      var strings = {
        test: '<img src=1 href=1 onerror="javascript:alert(1)"></img>'
      };
      var m = _immutable2.default.fromJS({ i18n: { strings: strings } });
      var html = i18n.html(m, 'test');
      expect(html.props.dangerouslySetInnerHTML.__html).not.toMatch(/javascript:alert/);
      expect(html.props.dangerouslySetInnerHTML.__html).toEqual('<img href="1" src="1">');
    });

    it('should allow target=_blank with noopener noreferrer attributes', function () {
      (0, _sanitizer.initSanitizer)();

      var i18n = require('../i18n');

      var strings = {
        test: '<a href="#" target="_blank">link</a>'
      };

      var m = _immutable2.default.fromJS({ i18n: { strings: strings } });
      var html = i18n.html(m, 'test');

      expect(html.props.dangerouslySetInnerHTML.__html).toEqual('<a href="#" target="_blank" rel="noopener noreferrer">link</a>');
    });
  });
});
