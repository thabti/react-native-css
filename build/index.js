'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _cssParse = require('css-parse');

var _cssParse2 = _interopRequireDefault(_cssParse);

var _toCamelCase = require('to-camel-case');

var _toCamelCase2 = _interopRequireDefault(_toCamelCase);

var _utilsJs = require('./utils.js');

var _utilsJs2 = _interopRequireDefault(_utilsJs);

var ReactNativeCss = (function () {
  function ReactNativeCss() {
    _classCallCheck(this, ReactNativeCss);
  }

  _createClass(ReactNativeCss, [{
    key: 'parse',
    value: function parse(input) {
      var _this = this;

      var output = arguments.length <= 1 || arguments[1] === undefined ? './style.js' : arguments[1];
      var prettyPrint = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

      if (_utilsJs2['default'].contains(input, /scss/)) {
        var _require$renderSync = require('node-sass').renderSync({
          file: input,
          outputStyle: 'compressed'
        });

        var css = _require$renderSync.css;

        var styleSheet = this.toJSS(css.toString());
        return _utilsJs2['default'].outputReactFriendlyStyle(styleSheet, output, prettyPrint);
      } else {
        _utilsJs2['default'].readFile(input, function (err, data) {
          if (err) {
            console.error(err);
            process.exit();
          }
          var styleSheet = _this.toJSS(data);
          _utilsJs2['default'].outputReactFriendlyStyle(styleSheet, output, _this.prettyPrint);
        });
      }
    }
  }, {
    key: 'toJSS',
    value: function toJSS(stylesheetString) {
      var changeArr = ['margin', 'padding'];

      var _ParseCSS = (0, _cssParse2['default'])(_utilsJs2['default'].clean(stylesheetString));

      var stylesheet = _ParseCSS.stylesheet;

      var JSONResult = {};

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = stylesheet.rules[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var rule = _step.value;

          if (rule.type !== 'rule') continue;

          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            var _loop = function () {
              var selector = _step2.value;

              selector = selector.replace(/\.|#/g, '');
              var styles = JSONResult[selector] = JSONResult[selector] || {};

              var declarationsToAdd = [];

              _iteratorNormalCompletion3 = true;
              _didIteratorError3 = false;
              _iteratorError3 = undefined;

              try {
                var _loop2 = function () {
                  var declaration = _step3.value;

                  if (declaration.type !== 'declaration') return 'continue';

                  var value = declaration.value;
                  var property = declaration.property;

                  if (_utilsJs2['default'].arrayContains(property, changeArr)) {
                    baseDeclaration = {
                      type: 'description'
                    };
                    values = value.replace(/px|\s*/g, '').split(',');

                    values.forEach(function (value, index, arr) {
                      arr[index] = parseInt(value);
                    });

                    length = values.length;

                    if (length === 1) {
                      _arr = ['Top', 'Bottom', 'Right', 'Left'];

                      for (_i = 0; _i < _arr.length; _i++) {
                        var prop = _arr[_i];
                        styles[property + prop] = values[0];
                      }
                    }

                    if (length === 2) {
                      _arr2 = ['Top', 'Bottom'];

                      for (_i2 = 0; _i2 < _arr2.length; _i2++) {
                        var prop = _arr2[_i2];
                        styles[property + prop] = values[0];
                      }

                      _arr3 = ['Top', 'Bottom'];
                      for (_i3 = 0; _i3 < _arr3.length; _i3++) {
                        var prop = _arr3[_i3];
                        styles[property + prop] = values[1];
                      }
                    }

                    if (length === 3) {
                      _arr4 = ['Left', 'Right'];

                      for (_i4 = 0; _i4 < _arr4.length; _i4++) {
                        var prop = _arr4[_i4];
                        styles[property + prop] = values[1];
                      }

                      styles[property + 'Top'] = values[0];
                      styles[property + 'Bottom'] = values[2];
                    }

                    if (length === 4) {
                      ['Top', 'Right', 'Bottom', 'Left'].forEach(function (prop, index) {
                        styles[property + prop] = values[index];
                      });
                    }
                  } else {

                    if (!isNaN(declaration.value)) {
                      declaration.value = parseInt(declaration.value);
                      styles[(0, _toCamelCase2['default'])(property)] = declaration.value;
                    } else {
                      styles[(0, _toCamelCase2['default'])(property)] = declaration.value;
                    }
                  }
                };

                for (_iterator3 = rule.declarations[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                  var _ret2 = _loop2();

                  if (_ret2 === 'continue') continue;
                }
              } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion3 && _iterator3['return']) {
                    _iterator3['return']();
                  }
                } finally {
                  if (_didIteratorError3) {
                    throw _iteratorError3;
                  }
                }
              }
            };

            for (var _iterator2 = rule.selectors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var _iteratorNormalCompletion3;

              var _didIteratorError3;

              var _iteratorError3;

              var _iterator3, _step3;

              var baseDeclaration;
              var values;
              var length;

              var _arr;

              var _i;

              var _arr2;

              var _i2;

              var _arr3;

              var _i3;

              var _arr4;

              var _i4;

              _loop();
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                _iterator2['return']();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          return JSONResult;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }]);

  return ReactNativeCss;
})();

exports['default'] = ReactNativeCss;
module.exports = exports['default'];