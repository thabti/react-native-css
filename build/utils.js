"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var Utils = (function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  _createClass(Utils, null, [{
    key: "arrayContains",
    value: function arrayContains(value, arr) {
      for (var i = 0; i < arr.length; i++) {
        if (value === arr[i]) {
          return true;
        }
      }
      return false;
    }
  }, {
    key: "clean",
    value: function clean(string) {
      return string.replace(/\r?\n|\r/g, "");
    }
  }, {
    key: "readFile",
    value: function readFile(file, cb) {
      _fs2["default"].readFile(file, "utf8", cb);
    }
  }, {
    key: "outputReactFriendlyStyle",
    value: function outputReactFriendlyStyle(style, outputFile, prettyPrint, literalObject) {
      var indentation = prettyPrint ? 4 : 0;
      var jsonOutput = JSON.stringify(style, null, indentation);
      var output = "module.exports = ";
      output += literalObject ? "" + jsonOutput : "require('react-native').StyleSheet.create(" + jsonOutput + ");";
      // Write to file
      _fs2["default"].writeFileSync(outputFile, output);
      return output;
    }
  }, {
    key: "contains",
    value: function contains(string, needle) {
      var search = string.match(needle);
      return search && search.length > 0;
    }
  }]);

  return Utils;
})();

exports["default"] = Utils;
module.exports = exports["default"];