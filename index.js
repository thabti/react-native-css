"use strict";

var parse       = require('css-parse'),
toCamelCase = require('to-camel-case'),
fs          = require('fs');


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

module.exports = function ReactStyleInCss(input, output) {

  var outputFile = output || 'style.js';
  var source = "";

  if(input.indexOf('scss') > -1) {

    var sass = require('node-sass').renderSync({
      file:  input
    })

    source = sass.css.toString();

  } else {

    source = fs.readFileSync(input).toString();

  }

  var style = parseCss(source.replace(/\r?\n|\r/g, ""));

  var wstream = fs.createWriteStream(outputFile);
  wstream.write("module.exports = require('react-native').StyleSheet.create(" + style + ");");
  wstream.end();
  return style
}
