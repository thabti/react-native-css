import ParseCSS from 'css-parse';
import toCamelCase from 'to-camel-case';
import utils from './utils.js'
export default class ReactNativeCss {

  constructor() {

  }

  parse(input, output = './style.js', prettyPrint = false, literalObject = false, cb) {
    if(utils.contains(input, /scss/)) {

      let {css} = require('node-sass').renderSync({
        file: input,
        outputStyle: 'compressed'
      });

      let styleSheet = this.toJSS(css.toString());
      utils.outputReactFriendlyStyle(styleSheet, output, prettyPrint, literalObject);

      if(cb) {
        cb(styleSheet);
      }

    } else {
      utils.readFile(input, (err, data) => {
        if (err) {
          console.error(err);
          process.exit();
        }
        let styleSheet = this.toJSS(data);
        utils.outputReactFriendlyStyle(styleSheet, output, prettyPrint, literalObject);

        if(cb) {
          cb(styleSheet);
        }
      });
    }
  }

  toJSS(stylesheetString) {
    const directions = ['top', 'right', 'bottom', 'left'];
    const changeArr = ['margin', 'padding', 'border-width', 'border-radius'];
    const numberize = ['width', 'height', 'font-size', 'line-height'].concat(directions);
    //special properties and shorthands that need to be broken down separately
    const specialProperties = {};
    ['border', 'border-top', 'border-right', 'border-bottom', 'border-left'].forEach(name=> {
      specialProperties[name] = {
        regex: /^\s*([0-9]+)(px)?\s+(solid|dotted|dashed)?\s*([a-z0-9#,\(\)\.\s]+)\s*$/i,
        map: {
          1: `${name}-width`,
          3: name == 'border' ? `${name}-style` : null,
          4: `${name}-color`
        }
      }
    });

    directions.forEach((dir) => {
      numberize.push(`border-${dir}-width`);
      changeArr.forEach((prop) => {
        numberize.push(`${prop}-${dir}`);
      })
    });

    //map of properties that when expanded use different directions than the default Top,Right,Bottom,Left.
    const directionMaps = {
      'border-radius':{
        'Top':'top-left',
        'Right':'top-right',
        'Bottom':'bottom-right',
        'Left': 'bottom-left'
      }
    };

    //Convert the shorthand property to the individual directions, handles edge cases, i.e. border-width and border-radius
    function directionToPropertyName(property,direction){
      let names = property.split('-');
      names.splice(1,0,directionMaps[property]?directionMaps[property][direction]:direction);
      return toCamelCase(names.join('-'));
    }

    // CSS properties that are not supported by React Native
    // The list of supported properties is at https://facebook.github.io/react-native/docs/style.html#supported-properties
    const unsupported = ['display'];

    let {stylesheet} = ParseCSS(utils.clean(stylesheetString));

    let JSONResult = {};

    for (let rule of stylesheet.rules) {
      if (rule.type !== 'rule') continue;

      for (let selector of rule.selectors) {
        selector = selector.replace(/\.|#/g, '');
        let styles = (JSONResult[selector] = JSONResult[selector] || {});

        let declarationsToAdd = [];

        for (let declaration of rule.declarations) {

          if (declaration.type !== 'declaration') continue;

          let value = declaration.value;
          let property = declaration.property;

          if (specialProperties[property]) {
            let special = specialProperties[property],
                matches = special.regex.exec(value)
            if (matches) {
              if (typeof special.map === 'function') {
                special.map(matches, styles, rule.declarations)
              } else {
                for (let key in special.map) {
                  if (matches[key] && special.map[key]) {
                    rule.declarations.push({
                      property: special.map[key],
                      value: matches[key],
                      type: 'declaration'
                    })
                  }
                }
              }
              continue;
            }
          }

          if (utils.arrayContains(property, unsupported)) continue;

          if (utils.arrayContains(property, numberize)) {
            var value = value.replace(/px|\s*/g, '');
            styles[toCamelCase(property)] = parseFloat(value);
          }

          else if (utils.arrayContains(property, changeArr)) {
            var baseDeclaration = {
              type: 'description'
            };

            var values = value.replace(/px/g, '').split(/[\s,]+/);

            values.forEach(function (value, index, arr) {
              arr[index] = parseInt(value);
            });

            var length = values.length;

            if (length === 1) {

              styles[toCamelCase(property)] = values[0]

            }

            if (length === 2) {

              for (let prop of ['Top', 'Bottom']) {
                styles[directionToPropertyName(property, prop)] = values[0];
              }

              for (let prop of ['Left', 'Right']) {
                styles[directionToPropertyName(property, prop)] = values[1];
              }
            }

            if (length === 3) {

              for (let prop of ['Left', 'Right']) {
                styles[directionToPropertyName(property, prop)] = values[1];
              }

              styles[directionToPropertyName(property, 'Top')] = values[0];
              styles[directionToPropertyName(property, 'Bottom')] = values[2];
            }

            if (length === 4) {
              ['Top', 'Right', 'Bottom', 'Left'].forEach(function (prop, index) {
                styles[directionToPropertyName(property, prop)] = values[index];
              });
            }
          }
          else {
            if (!isNaN(declaration.value) && property !== 'font-weight') {
              declaration.value = parseFloat(declaration.value);
            }

            styles[toCamelCase(property)] = declaration.value;
          }
        }
      }
    }
    return JSONResult
  }
}
