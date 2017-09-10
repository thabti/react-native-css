'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.default = toJSS;

var _parse = require('css/lib/parse');

var _parse2 = _interopRequireDefault(_parse);

var _toCamelCase = require('to-camel-case');

var _toCamelCase2 = _interopRequireDefault(_toCamelCase);

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.set');

var _lodash4 = _interopRequireDefault(_lodash3);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function toJSS(css) {
  for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    values[_key - 1] = arguments[_key];
  }

  var stylesheetString = Array.isArray(css) ? _utils.handleTags.apply(undefined, [css].concat(values)) : css;

  var _ParseCSS = (0, _parse2.default)(_utils2.default.clean(stylesheetString)),
      stylesheet = _ParseCSS.stylesheet;

  var directions = ['top', 'right', 'bottom', 'left'];
  var changeArr = ['margin', 'padding', 'border-width', 'border-radius'];
  var numberize = ['width', 'height', 'font-size', 'line-height'].concat(directions);
  // special properties and shorthands that need to be broken down separately
  var specialProperties = {};
  ['border', 'border-top', 'border-right', 'border-bottom', 'border-left'].forEach(function (name) {
    specialProperties[name] = {
      regex: /^\s*([0-9]+)(px)?\s+(solid|dotted|dashed)?\s*([a-z0-9#,\(\)\.\s]+)\s*$/i,
      map: {
        1: name + '-width',
        3: name === 'border' ? name + '-style' : null,
        4: name + '-color'
      }
    };
  });

  directions.forEach(function (dir) {
    numberize.push('border-' + dir + '-width');
    changeArr.forEach(function (prop) {
      numberize.push(prop + '-' + dir);
    });
  });

  // map of properties that when expanded
  // use different directions than the default Top,Right,Bottom,Left.
  var directionMaps = {
    'border-radius': {
      Top: 'top-left',
      Right: 'top-right',
      Bottom: 'bottom-right',
      Left: 'bottom-left'
    }
  };

  // Convert the shorthand property to the individual directions, handles edge cases,
  // i.e. border-width and border-radius
  function directionToPropertyName(property, direction) {
    var names = property.split('-');
    names.splice(1, 0, directionMaps[property] ? directionMaps[property][direction] : direction);
    return (0, _toCamelCase2.default)(names.join('-'));
  }

  // CSS properties that are not supported by React Native
  // The list of supported properties is at:
  // https://facebook.github.io/react-native/docs/style.html#supported-properties
  var unsupported = ['display'];

  var nonMatching = {
    'flex-grow': 'flex',
    'text-decoration': 'textDecorationLine',
    'vertical-align': 'textVerticalAlign'
  };

  var JSONResult = {};

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)(stylesheet.rules), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var rule = _step.value;

      if (rule.type !== 'rule') continue;

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        var _loop = function _loop() {
          var selector = _step2.value;

          selector = selector.replace(/\.|#/g, '');

          var styles = void 0;
          // check if there are any selectors with empty spaces, meaning they should be nested
          var composedSelector = selector.match(/\s+(\S)+/g);

          if (composedSelector) {
            // get the first selector from the nested selector
            var selectorPath = selector.match(/^\S+/)[0];
            while (composedSelector.length) {
              var currentSelector = composedSelector.shift().replace(/\s+/, '');
              selectorPath += '[' + currentSelector + ']';
            }

            // we don't have to be smart here. It's either an object or undefined.
            if (!(0, _lodash2.default)(JSONResult, selectorPath)) {
              (0, _lodash4.default)(JSONResult, selectorPath, {});
            }
            styles = (0, _lodash2.default)(JSONResult, selectorPath);
          } else {
            styles = JSONResult[selector] = JSONResult[selector] || {};
          }

          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            var _loop2 = function _loop2() {
              var declaration = _step3.value;

              if (declaration.type !== 'declaration') return 'continue';

              var value = declaration.value;
              var property = declaration.property;

              if (specialProperties[property]) {
                var special = specialProperties[property];
                var matches = special.regex.exec(value);
                if (matches) {
                  if (typeof special.map === 'function') {
                    special.map(matches, styles, rule.declarations);
                  } else {
                    for (var key in special.map) {
                      if (matches[key] && special.map[key]) {
                        rule.declarations.push({
                          property: special.map[key],
                          value: matches[key],
                          type: 'declaration'
                        });
                      }
                    }
                  }
                  return 'continue';
                }
              }

              if (_utils2.default.arrayContains(property, unsupported)) return 'continue';

              if (nonMatching[property]) {
                rule.declarations.push({
                  property: nonMatching[property],
                  value: value,
                  type: 'declaration'
                });
                return 'continue';
              }

              if (_utils2.default.arrayContains(property, numberize)) {
                var valueReplaced = value.replace(/px|\s*/g, '');
                styles[(0, _toCamelCase2.default)(property)] = parseFloat(valueReplaced);
              } else if (_utils2.default.arrayContains(property, changeArr)) {
                var _values = value.replace(/px/g, '').split(/[\s,]+/);

                _values.forEach(function (v, index, arr) {
                  arr[index] = parseInt(v);
                  return arr;
                });

                var length = _values.length;

                if (length === 1) {
                  styles[(0, _toCamelCase2.default)(property)] = _values[0];
                }

                if (length === 2) {
                  var _arr = ['Top', 'Bottom'];

                  for (var _i = 0; _i < _arr.length; _i++) {
                    var prop = _arr[_i];
                    styles[directionToPropertyName(property, prop)] = _values[0];
                  }

                  var _arr2 = ['Left', 'Right'];
                  for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
                    var _prop = _arr2[_i2];
                    styles[directionToPropertyName(property, _prop)] = _values[1];
                  }
                }

                if (length === 3) {
                  var _arr3 = ['Left', 'Right'];

                  for (var _i3 = 0; _i3 < _arr3.length; _i3++) {
                    var _prop2 = _arr3[_i3];
                    styles[directionToPropertyName(property, _prop2)] = _values[1];
                  }

                  styles[directionToPropertyName(property, 'Top')] = _values[0];
                  styles[directionToPropertyName(property, 'Bottom')] = _values[2];
                }

                if (length === 4) {
                  ['Top', 'Right', 'Bottom', 'Left'].forEach(function (prop, index) {
                    styles[directionToPropertyName(property, prop)] = _values[index];
                  });
                }
              } else {
                if (!isNaN(declaration.value) && property !== 'font-weight') {
                  declaration.value = parseFloat(declaration.value);
                }

                styles[(0, _toCamelCase2.default)(property)] = declaration.value;
              }
            };

            for (var _iterator3 = (0, _getIterator3.default)(rule.declarations), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var _ret2 = _loop2();

              if (_ret2 === 'continue') continue;
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        };

        for (var _iterator2 = (0, _getIterator3.default)(rule.selectors), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          _loop();
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return JSONResult;
}