import ParseCSS from 'css-parse';
import toCamelCase from 'to-camel-case';
import fs from 'fs';

export default {

	parse (input, output = './style.js') {


		if (input.indexOf('.scss') > 1) {

			let {css} = require('node-sass').renderSync({
				file: input,
				outputStyle: 'compressed'
			});

			let styleSheet = this.handleRulesAndReturnCSSJSON(css.toString());
			return helpers.outputReactFriendlyStyle(styleSheet, output)

		} else {

			helpers.readFile(input, (err, data) => {
				let styleSheet = this.handleRulesAndReturnCSSJSON(data);
				helpers.outputReactFriendlyStyle(styleSheet, output)
			});
		}

	},

	handleRulesAndReturnCSSJSON(stylesheetString) {

		const changeArr = ['margin', 'padding'];

		let {stylesheet} = ParseCSS(helpers.clean(stylesheetString));

		let JSONResult = {};

		for (let rule of stylesheet.rules) {
			if (rule.type !== 'rule') return;

			for (let selector of rule.selectors) {
				selector = selector.replace(/\.|#/g, '');
				let styles = (JSONResult[selector] = JSONResult[selector] || {});

				let declarationsToAdd = [];


				for (let declaration of rule.declarations) {
					if (declaration.type !== 'declaration') return;

					let value = declaration.value;
					let property = declaration.property;


					if (helpers.indexOf(property, changeArr)) {
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

						if (!isNaN(declaration.value)) {
							declaration.value = parseInt(declaration.value);
							styles[toCamelCase(property)] = declaration.value;
						} else {
							styles[toCamelCase(property)] = declaration.value;
						}
					}

				}
			}
		}

		return JSONResult;

	}
}


let helpers = {

	indexOf(value, arr) {
		var flag = false;
		for (var i = 0; i < arr.length; i++) {
			if (value === arr[i]) {
				return true
			}
		}
		return flag;
	},

	clean(string) {
		return string.replace(/\r?\n|\r/g, "");
	},

	readFile(file, cb) {
		fs.readFile(file, "utf8", cb);
	},

	outputReactFriendlyStyle(style, outputFile) {

		var wstream = fs.createWriteStream(outputFile);
		wstream.write(`module.exports = require('react-native').StyleSheet.create(${JSON.stringify(style)});`);
		wstream.end();
		return style;
	}
};
