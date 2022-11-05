'use strict';

exports.__esModule = true;
exports.set = set;
exports.reset = reset;
exports.getValue = getValue;

var _index = require('./index');

function validate(captcha) {
  return !!captcha;
}

function set(m, captcha, wasInvalid) {
  m = (0, _index.setField)(m, 'captcha', captcha, validate);
  if (wasInvalid) {
    m = (0, _index.setFieldShowInvalid)(m, 'captcha', true);
  }
  return m;
}

function reset(m, wasInvalid) {
  return set(m, '', wasInvalid);
}

function getValue(m) {
  return (0, _index.getFieldValue)(m, 'captcha');
}
