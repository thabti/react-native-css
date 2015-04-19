"use strict";

var parse = require('css-parse'),
    toCamelCase = require('to-camel-case'),
    fs = require('fs');

var isCSS = /\.(css|styl|sass|scss)$/;

function parseCss(css) {
  var stylesheet=  parse(css);

  var modExports = {};

  stylesheet.stylesheet.rules.forEach(function(rule) {
        if (rule.type !== 'rule') return;
        rule.selectors.forEach(function(selector) {
          var styles = (modExports[selector] = modExports[selector] || {});
          rule.declarations.forEach(function(declaration) {
            if (declaration.type !== 'declaration') return;

            if(isNumeric(declaration.value)) {
              declaration.value = parseInt(declaration.value)
              styles[toCamelCase(declaration.property)] = declaration.value;
            } else {
              styles[toCamelCase(declaration.property)] = declaration.value;
            }

          });
        });
      });
      return  JSON.stringify(modExports)

}

function isNumeric(num){
    return !isNaN(num)
}

module.exports = function ReactStyleInCss(filePath, cb) {
  fs.readFile(filePath, function (err, data) {
    if (err) throw err;
    var source = data.toString();
    var result = parseCss(source.replace(/\r?\n|\r/g, ""));
    cb(result);
  });
}
