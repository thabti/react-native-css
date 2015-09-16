'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _cssParse = require('css-parse');

var _cssParse2 = _interopRequireDefault(_cssParse);

var _toCamelCase = require('to-camel-case');

var _toCamelCase2 = _interopRequireDefault(_toCamelCase);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

exports['default'] = {

	parse: function parse(input) {
		var _this = this;

		var output = arguments.length <= 1 || arguments[1] === undefined ? './style.js' : arguments[1];

		if (input.includes('scss')) {

			// todo: add Sass  supprt

			//let {css} = require('node-sass').renderSync({
			//	file: input,
			//	outputStyle: 'compressed'
			//});
			//
			//let styleSheet = this.handleRulesAndReturnCSSJSON(css);
			//return helpers.outputReactFriendlyStyle(styleSheet, output)

			console.error("Error: Sass support has been disabled, submit an issue.");
		} else {

			helpers.readFile(input, function (err, data) {
				var styleSheet = _this.handleRulesAndReturnCSSJSON(data);
				helpers.outputReactFriendlyStyle(styleSheet, output);
			});
		}
	},

	handleRulesAndReturnCSSJSON: function handleRulesAndReturnCSSJSON(stylesheetString) {

		var changeArr = ['margin', 'padding'];

		var _ParseCSS = (0, _cssParse2['default'])(helpers.clean(stylesheetString));

		var stylesheet = _ParseCSS.stylesheet;

		var JSONResult = {};

		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = stylesheet.rules[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var rule = _step.value;

				if (rule.type !== 'rule') return;

				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					var _loop = function () {
						var selector = _step2.value;

						selector = selector.replace(/\.|#/g, '');
						var styles = JSONResult[selector] = JSONResult[selector] || {};

						var declarationsToAdd = [];

						_iteratorNormalCompletion3 = true;
						_didIteratorError3 = false;
						_iteratorError3 = undefined;

						try {
							var _loop2 = function () {
								var declaration = _step3.value;

								if (declaration.type !== 'declaration') return {
										v: {
											v: undefined
										}
									};

								var value = declaration.value;
								var property = declaration.property;

								if (helpers.indexOf(property, changeArr)) {
									baseDeclaration = {
										type: 'description'
									};
									values = value.replace(/px|\s*/g, '').split(',');

									values.forEach(function (value, index, arr) {
										arr[index] = parseInt(value);
									});

									length = values.length;

									if (length === 1) {
										_arr = ['Top', 'Bottom', 'Right', 'Left'];

										for (_i = 0; _i < _arr.length; _i++) {
											var prop = _arr[_i];
											styles[property + prop] = values[0];
										}
									}

									if (length === 2) {
										_arr2 = ['Top', 'Bottom'];

										for (_i2 = 0; _i2 < _arr2.length; _i2++) {
											var prop = _arr2[_i2];
											styles[property + prop] = values[0];
										}

										_arr3 = ['Top', 'Bottom'];
										for (_i3 = 0; _i3 < _arr3.length; _i3++) {
											var prop = _arr3[_i3];
											styles[property + prop] = values[1];
										}
									}

									if (length === 3) {
										_arr4 = ['Left', 'Right'];

										for (_i4 = 0; _i4 < _arr4.length; _i4++) {
											var prop = _arr4[_i4];
											styles[property + prop] = values[1];
										}

										styles[property + 'Top'] = values[0];
										styles[property + 'Bottom'] = values[2];
									}

									if (length === 4) {
										['Top', 'Right', 'Bottom', 'Left'].forEach(function (prop, index) {
											styles[property + prop] = values[index];
										});
									}
								} else {
									if (Number.isNaN(declaration.value)) {
										declaration.value = parseInt(declaration.value);
										styles[(0, _toCamelCase2['default'])(property)] = declaration.value;
									} else {
										styles[(0, _toCamelCase2['default'])(property)] = declaration.value;
									}
								}
							};

							for (_iterator3 = rule.declarations[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
								var _ret2 = _loop2();

								if (typeof _ret2 === 'object') return _ret2.v;
							}
						} catch (err) {
							_didIteratorError3 = true;
							_iteratorError3 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion3 && _iterator3['return']) {
									_iterator3['return']();
								}
							} finally {
								if (_didIteratorError3) {
									throw _iteratorError3;
								}
							}
						}
					};

					for (var _iterator2 = rule.selectors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var _iteratorNormalCompletion3;

						var _didIteratorError3;

						var _iteratorError3;

						var _iterator3, _step3;

						var baseDeclaration;
						var values;
						var length;

						var _arr;

						var _i;

						var _arr2;

						var _i2;

						var _arr3;

						var _i3;

						var _arr4;

						var _i4;

						var _ret = _loop();

						if (typeof _ret === 'object') return _ret.v;
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2['return']) {
							_iterator2['return']();
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
				if (!_iteratorNormalCompletion && _iterator['return']) {
					_iterator['return']();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		return JSONResult;
	}
};

var helpers = {

	indexOf: function indexOf(value, arr) {
		var flag = false;
		for (var i = 0; i < arr.length; i++) {
			if (value === arr[i]) {
				return true;
			}
		}
		return flag;
	},

	clean: function clean(string) {
		return string.replace(/\r?\n|\r/g, "");
	},

	readFile: function readFile(file, cb) {
		_fs2['default'].readFile(file, "utf8", cb);
	},

	outputReactFriendlyStyle: function outputReactFriendlyStyle(style, outputFile) {

		var wstream = _fs2['default'].createWriteStream(outputFile);
		wstream.write('module.exports = require(\'react-native\').StyleSheet.create(' + JSON.stringify(style) + ');');
		wstream.end();
		return style;
	}
};
module.exports = exports['default'];