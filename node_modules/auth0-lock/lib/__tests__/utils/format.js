'use strict';

var _format = require('../../utils/format');

var _format2 = _interopRequireDefault(_format);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('format', function () {
  it('can format a string', function () {
    expect((0, _format2.default)('a string')).toEqual('a string');
  });

  it('can replace a string', function () {
    expect((0, _format2.default)('%s', 'test')).toEqual('test');
  });

  it('can replace a string inside a string', function () {
    expect((0, _format2.default)('a string: %s', 'test')).toEqual('a string: test');
  });

  it('can replace multiple strings', function () {
    expect((0, _format2.default)('%s:%s', 'a', 'b')).toEqual('a:b');
  });

  it('can replace with a number', function () {
    expect((0, _format2.default)('%d', 12)).toEqual('12');
  });

  it('can format an object', function () {
    expect((0, _format2.default)('%j', { key: 'value' })).toEqual('{"key":"value"}');
  });
});
