'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

const _createClass = (function () { function defineProperties(target, props) { for (let i = 0; i < props.length; i++) { const descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }());

const _fs = require('fs');

const _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

const Utils = (function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  _createClass(Utils, null, [{
    key: 'arrayContains',
    value: function arrayContains(value, arr) {
      for (let i = 0; i < arr.length; i++) {
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
    key: 'readFile',
    value: function readFile(file, cb) {
      _fs2.default.readFile(file, 'utf8', cb);
    }
  }, {
    key: 'outputReactFriendlyStyle',
    value: function outputReactFriendlyStyle(style, outputFile, prettyPrint, literalObject) {
      const indentation = prettyPrint ? 4 : 0;
      const jsonOutput = JSON.stringify(style, null, indentation);
      let output = 'module.exports = ';
      output += literalObject ? `${jsonOutput}` : `require('react-native').StyleSheet.create(${jsonOutput});`;
      // Write to file
      _fs2.default.writeFileSync(outputFile, output);
      return output;
    }
  }, {
    key: 'contains',
    value: function contains(string, needle) {
      const search = string.match(needle);
      return search && search.length > 0;
    }
  }]);

  return Utils;
}());

exports.default = Utils;
