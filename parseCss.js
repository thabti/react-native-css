var parse = require('css-parse');
var toCamelCase = require('to-camel-case');

var changeArr = ['margin', 'padding'];


var parseCss = function (css) {
	var stylesheet = parse(css);

	var json = {};

	//console.log(JSON.stringify(stylesheet, null, 4));

	stylesheet.stylesheet.rules.forEach(function (rule) {
		//console.log(rule);


		if (rule.type !== 'rule') return;
		rule.selectors.forEach(function (selector) {
			selector = selector.replace(/\.|#/g, '');
			var styles = (json[selector] = json[selector] || {});

			var declarationsToAdd = [];

			rule.declarations.forEach(function (declaration) {
				if (declaration.type !== 'declaration') return;

				var value = declaration.value;
				var property = declaration.property;


				if (_indexOf(property, changeArr)) {
					var baseDeclaration = {
						type: 'description'
					};

					var values = value.replace(/px|\s*/g, '').split(',');
					//console.log(values);

					values.forEach(function (value, index, arr) {
						arr[index] = parseInt(value);
					});

					var length = values.length;

					if (length === 1) {
						['Top', 'Bottom', 'Right', 'Left'].forEach(function (prop, index, arr) {
							styles[property + prop] = values[0];
						});
					}

					if (length === 2) {
						['Top', 'Bottom'].forEach(function (prop) {
							styles[property + prop] = values[0];
						});
						['Right', 'Left'].forEach(function (prop) {
							styles[property + prop] = values[1];
						});
					}

					if (length === 3) {
						['Left', 'Right'].forEach(function (prop) {
							styles[property + prop] = values[1];
						});
						styles[property + 'Top'] = values[0];
						styles[property + 'Bottom'] = values[2];
					}

					if (length === 4) {
						['Top', 'Right', 'Bottom', 'Left'].forEach(function (prop, index) {
							styles[property + prop] = values[index];
						});
					}
				}
				else {
					if (_isNumeric(declaration.value)) {
						declaration.value = parseInt(declaration.value);
						styles[toCamelCase(property)] = declaration.value;
					} else {
						styles[toCamelCase(property)] = declaration.value;
					}
				}


			});
		});
	});
	return JSON.stringify(json, null, 4)
};


function _isNumeric(num) {
	return !isNaN(num)
}

function _indexOf(value, arr) {
	var flag = false;
	for (var i = 0; i < arr.length; i++) {
		if (value === arr[i]) {
			return true
		}
	}
	return flag;
}

module.exports = parseCss;


