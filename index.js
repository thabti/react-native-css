"use strict";

var parseCss = require('./parseCss.js'),
	fs = require('fs');


module.exports = function ReactStyleInCss(input, output) {

	var outputFile = output || 'style.js';
	var source = "";

	if (input.indexOf('scss') > -1) {

		var sass = require('node-sass').renderSync({
			file: input
		});

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
