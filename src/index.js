import ParseCSS from 'css/lib/parse';
import toCamelCase from 'to-camel-case';
import _get from 'lodash.get';
import _set from 'lodash.set';
import utils from './utils';

export default function toJSS(css) {
  const stylesheetString = Array.isArray(css) ? css[0] : css;
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
        3: name === 'border' ? `${name}-style` : null,
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

  // map of properties that when expanded
  // use different directions than the default Top,Right,Bottom,Left.
  const directionMaps = {
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
    const names = property.split('-');
    names.splice(1, 0, directionMaps[property] ? directionMaps[property][direction] : direction);
    return toCamelCase(names.join('-'));
  }

  // CSS properties that are not supported by React Native
  // The list of supported properties is at:
  // https://facebook.github.io/react-native/docs/style.html#supported-properties
  const unsupported = ['display'];

  const nonMatching = {
    'flex-grow': 'flex',
    'text-decoration': 'textDecorationLine',
    'vertical-align': 'textVerticalAlign'
  };

  const { stylesheet } = ParseCSS(utils.clean(stylesheetString));
  const JSONResult = {};

  for (const rule of stylesheet.rules) {
    if (rule.type !== 'rule') continue;

    for (let selector of rule.selectors) {
      selector = selector.replace(/\.|#/g, '');

      let styles;
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
        styles = (JSONResult[selector] = JSONResult[selector] || {});
      }


      for (const declaration of rule.declarations) {
        if (declaration.type !== 'declaration') continue;

        const value = declaration.value;
        const property = declaration.property;

        if (specialProperties[property]) {
          const special = specialProperties[property];
          const matches = special.regex.exec(value);
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
            continue;
          }
        }

        if (utils.arrayContains(property, unsupported)) continue;

        if (nonMatching[property]) {
          rule.declarations.push({
            property: nonMatching[property],
            value,
            type: 'declaration'
          });
          continue;
        }

        if (utils.arrayContains(property, numberize)) {
          const valueReplaced = value.replace(/px|\s*/g, '');
          styles[toCamelCase(property)] = parseFloat(valueReplaced);
        } else if (utils.arrayContains(property, changeArr)) {
          const values = value.replace(/px/g, '').split(/[\s,]+/);

          values.forEach((v, index, arr) => {
            arr[index] = parseInt(v);
            return arr;
          });

          const length = values.length;

          if (length === 1) {
            styles[toCamelCase(property)] = values[0];
          }

          if (length === 2) {
            for (const prop of ['Top', 'Bottom']) {
              styles[directionToPropertyName(property, prop)] = values[0];
            }

            for (const prop of ['Left', 'Right']) {
              styles[directionToPropertyName(property, prop)] = values[1];
            }
          }

          if (length === 3) {
            for (const prop of ['Left', 'Right']) {
              styles[directionToPropertyName(property, prop)] = values[1];
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

          styles[toCamelCase(property)] = declaration.value;
        }
      }
    }
  }

  return JSONResult;
}
