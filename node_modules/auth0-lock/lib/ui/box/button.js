'use strict';

exports.__esModule = true;
exports.BackButton = exports.CloseButton = undefined;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SvgBackIcon = function SvgBackIcon() {
  return _react2.default.createElement(
    'svg',
    {
      'aria-hidden': 'true',
      focusable: 'false',
      enableBackground: 'new 0 0 24 24',
      version: '1.0',
      viewBox: '0 0 24 24',
      xmlSpace: 'preserve',
      xmlns: 'http://www.w3.org/2000/svg',
      xmlnsXlink: 'http://www.w3.org/1999/xlink'
    },
    ' ',
    _react2.default.createElement('polyline', {
      fill: 'none',
      points: '12.5,21 3.5,12 12.5,3 ',
      stroke: '#000000',
      strokeMiterlimit: '10',
      strokeWidth: '2'
    }),
    ' ',
    _react2.default.createElement('line', {
      fill: 'none',
      stroke: '#000000',
      strokeMiterlimit: '10',
      strokeWidth: '2',
      x1: '22',
      x2: '3.5',
      y1: '12',
      y2: '12'
    }),
    ' '
  );
};
var SvgCloseIcon = function SvgCloseIcon() {
  return _react2.default.createElement(
    'svg',
    {
      'aria-hidden': 'true',
      focusable: 'false',
      enableBackground: 'new 0 0 128 128',
      version: '1.1',
      viewBox: '0 0 128 128',
      xmlSpace: 'preserve',
      xmlns: 'http://www.w3.org/2000/svg',
      xmlnsXlink: 'http://www.w3.org/1999/xlink'
    },
    _react2.default.createElement(
      'g',
      null,
      _react2.default.createElement('polygon', {
        fill: '#373737',
        points: '123.5429688,11.59375 116.4765625,4.5185547 64.0019531,56.9306641 11.5595703,4.4882813     4.4882813,11.5595703 56.9272461,63.9970703 4.4570313,116.4052734 11.5244141,123.4814453 63.9985352,71.0683594     116.4423828,123.5117188 123.5126953,116.4414063 71.0732422,64.0019531   '
      })
    )
  );
};

var IconButton = function IconButton(_ref) {
  var lockId = _ref.lockId,
      name = _ref.name,
      _onClick = _ref.onClick,
      svg = _ref.svg;
  return _react2.default.createElement(
    'span',
    {
      id: lockId + '-' + name + '-button',
      role: 'button',
      tabIndex: 0,
      className: 'auth0-lock-' + name + '-button',
      onClick: function onClick(e) {
        e.preventDefault();
        _onClick();
      },
      onKeyPress: function onKeyPress(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          _onClick();
        }
      },
      'aria-label': name
    },
    svg
  );
};

IconButton.propTypes = {
  name: _propTypes2.default.string.isRequired,
  onClick: _propTypes2.default.func.isRequired,
  svg: _propTypes2.default.element.isRequired
};

var CloseButton = exports.CloseButton = function CloseButton(_ref2) {
  var lockId = _ref2.lockId,
      onClick = _ref2.onClick;
  return _react2.default.createElement(IconButton, { lockId: lockId, name: 'close', onClick: onClick, svg: _react2.default.createElement(SvgCloseIcon, null) });
};

CloseButton.propTypes = {
  onClick: _propTypes2.default.func.isRequired
};

var BackButton = exports.BackButton = function BackButton(_ref3) {
  var lockId = _ref3.lockId,
      onClick = _ref3.onClick;
  return _react2.default.createElement(IconButton, { lockId: lockId, name: 'back', onClick: onClick, svg: _react2.default.createElement(SvgBackIcon, null) });
};

BackButton.propTypes = {
  onClick: _propTypes2.default.func.isRequired
};
