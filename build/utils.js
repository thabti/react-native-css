'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleTags = undefined;

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; (0, _defineProperty2.default)(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Utils = function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  _createClass(Utils, null, [{
    key: 'arrayContains',
    value: function arrayContains(value, arr) {
      for (var i = 0; i < arr.length; i++) {
        if (value === arr[i]) {
          return true;
        }
      }
      return false;
    }
  }, {
    key: 'clean',
    value: function clean(string) {
      return string.replace(/\r?\n|\r/g, '');
    }
  }, {
    key: 'contains',
    value: function contains(string, needle) {
      var search = string.match(needle);
      return search && search.length > 0;
    }
  }]);

  return Utils;
}();

exports.default = Utils;
var handleTags = exports.handleTags = function handleTags(strings) {
  var result = '';

  for (var i = 0; i < strings.length; i++) {
    result += strings[i];
    if (i < (arguments.length <= 1 ? 0 : arguments.length - 1)) {
      result += arguments.length <= i + 1 ? undefined : arguments[i + 1];
    }
  }

  return result;
};