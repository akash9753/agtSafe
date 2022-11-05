'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = format;
// Code attribution
// Inlined and modified from https://github.com/browserify/node-util/blob/e37ce41f4063bcd7bc27e01470d6654053bdcd14/util.js#L33-L69
// Copyright Joyent, Inc. and other Node contributors.
// Please see LICENSE for full copyright and license attribution.
var formatRegExp = /%[sdj%]/g;

function format(f) {
  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function (x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s':
        return String(args[i++]);
      case '%d':
        return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (x === null || !isObject(x)) {
      str += ' ' + x;
    } else if (x !== null) {
      str += ' ' + JSON.stringify(x);
    }
  }
  return str;
}

function isObject(arg) {
  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null;
}
