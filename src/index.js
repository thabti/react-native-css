import ParseCSS from 'css-parse';
import toCamelCase from 'to-camel-case';
import utils from './utils.js'
export default class ReactNativeCss {

  constructor() {

  }

  parse(input, output = './style.js', prettyPrint = false, cb) {
    if(utils.contains(input, /scss/)) {

      let {css} = require('node-sass').renderSync({
        file: input,
        outputStyle: 'compressed'
      });

      let styleSheet = this.toJSS(css.toString());
      utils.outputReactFriendlyStyle(styleSheet, output, prettyPrint);

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
        utils.outputReactFriendlyStyle(styleSheet, output, this.prettyPrint);

        if(cb) {
          cb(styleSheet);
        }
      });
    }
  }

  toJSS(stylesheetString) {
    const changeArr = ['margin', 'padding'];
    const numberize = ['width', 'height', 'font-size'];

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

          if (utils.arrayContains(property, unsupported)) continue;

          if (utils.arrayContains(property, numberize)) {
            var value = value.replace(/px|\s*/g, '');
            styles[toCamelCase(property)] = parseInt(value);
          }

          else if (utils.arrayContains(property, changeArr)) {
            var baseDeclaration = {
              type: 'description'
            };

            var values = value.replace(/px|\s*/g, '').split(',');

            values.forEach(function (value, index, arr) {
              arr[index] = parseInt(value);
            });

            var length = values.length;

            if (length === 1) {

              for (let prop of ['Top', 'Bottom', 'Right', 'Left']) {
                styles[property + prop] = values[0];
              }

            }

            if (length === 2) {

              for (let prop of ['Top', 'Bottom']) {
                styles[property + prop] = values[0];
              }

              for (let prop of ['Top', 'Bottom']) {
                styles[property + prop] = values[1];
              }
            }

            if (length === 3) {

              for (let prop of ['Left', 'Right']) {
                styles[property + prop] = values[1];
              }

              styles[`${property}Top`] = values[0];
              styles[`${property}Bottom`] = values[2];
            }

            if (length === 4) {
              ['Top', 'Right', 'Bottom', 'Left'].forEach(function (prop, index) {
                styles[property + prop] = values[index];
              });
            }
          }
          else {
            if (!isNaN(declaration.value) && property !== 'font-weight') {
              declaration.value = parseInt(declaration.value);
            }

            styles[toCamelCase(property)] = declaration.value;
          }
        }
      }
    }
    return JSONResult
  }
}
