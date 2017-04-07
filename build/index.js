'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = toJSS;

const _parse = require('css/lib/parse');

const _parse2 = _interopRequireDefault(_parse);

const _toCamelCase = require('to-camel-case');

const _toCamelCase2 = _interopRequireDefault(_toCamelCase);

const _utils = require('./utils');

const _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function toJSS(stylesheetString) {
  const directions = ['top', 'right', 'bottom', 'left'];
  const changeArr = ['margin', 'padding', 'border-width', 'border-radius'];
  const numberize = ['width', 'height', 'font-size', 'line-height'].concat(directions);
  // special properties and shorthands that need to be broken down separately
  const specialProperties = {};
  ['border', 'border-top', 'border-right', 'border-bottom', 'border-left'].forEach((name) => {
    specialProperties[name] = {
      regex: /^\s*([0-9]+)(px)?\s+(solid|dotted|dashed)?\s*([a-z0-9#,\(\)\.\s]+)\s*$/i,
      map: {
        1: `${name}-width`,
        3: name == 'border' ? `${name}-style` : null,
        4: `${name}-color`
      }
    };
  });

  directions.forEach((dir) => {
    numberize.push(`border-${dir}-width`);
    changeArr.forEach((prop) => {
      numberize.push(`${prop}-${dir}`);
    });
  });

  // map of properties that when expanded use different directions than the default Top,Right,Bottom,Left.
  const directionMaps = {
    'border-radius': {
      Top: 'top-left',
      Right: 'top-right',
      Bottom: 'bottom-right',
      Left: 'bottom-left'
    }
  };

  // Convert the shorthand property to the individual directions, handles edge cases, i.e. border-width and border-radius
  function directionToPropertyName(property, direction) {
    const names = property.split('-');
    names.splice(1, 0, directionMaps[property] ? directionMaps[property][direction] : direction);
    return (0, _toCamelCase2.default)(names.join('-'));
  }

  // CSS properties that are not supported by React Native
  // The list of supported properties is at https://facebook.github.io/react-native/docs/style.html#supported-properties
  const unsupported = ['display'];

  const nonMatching = {
    'flex-grow': 'flex',
    'text-decoration': 'textDecorationLine',
    'vertical-align': 'textVerticalAlign'
  };

  let _ParseCSS = (0, _parse2.default)(_utils2.default.clean(stylesheetString)),
    stylesheet = _ParseCSS.stylesheet;

  const JSONResult = {};

  let _iteratorNormalCompletion = true;
  let _didIteratorError = false;
  let _iteratorError;

  try {
    for (var _iterator = stylesheet.rules[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var rule = _step.value;

      if (rule.type !== 'rule') continue;

      let _iteratorNormalCompletion2 = true;
      let _didIteratorError2 = false;
      let _iteratorError2;

      try {
        const _loop = function _loop() {
          let selector = _step2.value;

          selector = selector.replace(/\.|#/g, '');

          let styles = void 0;
          // check if there are any selectors with empty spaces, meaning they should be nested
          const composedSelector = selector.match(/\s+(\S)+/g);

          if (composedSelector) {
            // get the first selector from the nested selector
            let selectorPath = selector.match(/^\S+/)[0];
            while (composedSelector.length) {
              const currentSelector = composedSelector.shift().replace(/\s+/, '');
              selectorPath += `[${currentSelector}]`;
            }

            // we don't have to be smart here. It's either an object or undefined.
            if (!_get(JSONResult, selectorPath)) {
              _set(JSONResult, selectorPath, {});
            }
            styles = _get(JSONResult, selectorPath);
          } else {
            styles = JSONResult[selector] = JSONResult[selector] || {};
          }

          const declarationsToAdd = [];

          let _iteratorNormalCompletion3 = true;
          let _didIteratorError3 = false;
          let _iteratorError3;

          try {
            const _loop2 = function _loop2() {
              const declaration = _step3.value;

              if (declaration.type !== 'declaration') return 'continue';

              const value = declaration.value;
              const property = declaration.property;

              if (specialProperties[property]) {
                let special = specialProperties[property],
                  matches = special.regex.exec(value);
                if (matches) {
                  if (typeof special.map === 'function') {
                    special.map(matches, styles, rule.declarations);
                  } else {
                    for (const key in special.map) {
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
                  value,
                  type: 'declaration'
                });
                return 'continue';
              }

              if (_utils2.default.arrayContains(property, numberize)) {
                var _value = _value.replace(/px|\s*/g, '');
                styles[(0, _toCamelCase2.default)(property)] = parseFloat(_value);
              } else if (_utils2.default.arrayContains(property, changeArr)) {
                const baseDeclaration = {
                  type: 'description'
                };

                values = value.replace(/px/g, '').split(/[\s,]+/);


                values.forEach((value, index, arr) => {
                  arr[index] = parseInt(value);
                });

                const length = values.length;

                if (length === 1) {
                  styles[(0, _toCamelCase2.default)(property)] = values[0];
                }

                if (length === 2) {
                  const _arr = ['Top', 'Bottom'];

                  for (let _i = 0; _i < _arr.length; _i++) {
                    const prop = _arr[_i];
                    styles[directionToPropertyName(property, prop)] = values[0];
                  }

                  const _arr2 = ['Left', 'Right'];
                  for (let _i2 = 0; _i2 < _arr2.length; _i2++) {
                    const _prop = _arr2[_i2];
                    styles[directionToPropertyName(property, _prop)] = values[1];
                  }
                }

                if (length === 3) {
                  const _arr3 = ['Left', 'Right'];

                  for (let _i3 = 0; _i3 < _arr3.length; _i3++) {
                    const _prop2 = _arr3[_i3];
                    styles[directionToPropertyName(property, _prop2)] = values[1];
                  }

                  styles[directionToPropertyName(property, 'Top')] = values[0];
                  styles[directionToPropertyName(property, 'Bottom')] = values[2];
                }

                if (length === 4) {
                  ['Top', 'Right', 'Bottom', 'Left'].forEach((prop, index) => {
                    styles[directionToPropertyName(property, prop)] = values[index];
                  });
                }
              } else {
                if (!isNaN(declaration.value) && property !== 'font-weight') {
                  declaration.value = parseFloat(declaration.value);
                }

                styles[(0, _toCamelCase2.default)(property)] = declaration.value;
              }
            };

            for (var _iterator3 = rule.declarations[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              const _ret2 = _loop2();

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

        for (var _iterator2 = rule.selectors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var values;

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
