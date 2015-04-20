"use strict";

var parse       = require('css-parse'),
    toCamelCase = require('to-camel-case'),
    fs          = require('fs');
    Promise     = require('es6-promise').Promise;

var isCSS       = /\.(css|styl|sass|scss)$/;

function parseCss(css) {
  var stylesheet=  parse(css);

  var json = {};

  stylesheet.stylesheet.rules.forEach(function(rule) {
        if (rule.type !== 'rule') return;
        rule.selectors.forEach(function(selector) {
          var styles = (json[selector] = json[selector] || {});

          rule.declarations.forEach(function(declaration) {
            if (declaration.type !== 'declaration') return;

            if(_isNumeric(declaration.value)) {
              declaration.value = parseInt(declaration.value)
              styles[toCamelCase(declaration.property)] = declaration.value;
            } else {
              styles[toCamelCase(declaration.property)] = declaration.value;
            }

          });
        });
      });
      return  JSON.stringify(json)

}

function _isNumeric(num){
    return !isNaN(num)
}

module.exports = function ReactStyleInCss(filePath) {

  var source = fs.readFileSync(filePath).toString();
  return parseCss(source.replace(/\r?\n|\r/g, ""));

  // return new Promise(function(resolve, reject) {
  //   fs.readFile(filePath, function (err, data) {
  //     if (err) {
  //       reject(err)
  //     } else {
  //       var source = data.toString();
  //       var result = parseCss(source.replace(/\r?\n|\r/g, ""));
  //       resolve(result);
  //     }
  //   });
  // });


}
