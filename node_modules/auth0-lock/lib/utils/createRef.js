"use strict";

exports.__esModule = true;
exports.createRef = createRef;
/**
 * This is similar to React.createRef(),
 * the current version of this library doesn't support it.
 * @returns {function} the ref func
 */
function createRef() {
  var f = function f(element) {
    f.current = element;
  };
  return f;
}
