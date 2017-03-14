Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _cssParse=require('css-parse');var _cssParse2=_interopRequireDefault(_cssParse);
var _toCamelCase=require('to-camel-case');var _toCamelCase2=_interopRequireDefault(_toCamelCase);
var _utils=require('./utils');var _utils2=_interopRequireDefault(_utils);
var _inheritance=require('./inheritance');var _inheritance2=_interopRequireDefault(_inheritance);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var

ReactNativeCss=function(){function ReactNativeCss(){_classCallCheck(this,ReactNativeCss);}_createClass(ReactNativeCss,[{key:'parse',value:function parse(_ref)

{var input=_ref.input,output=_ref.output,_ref$prettyPrint=_ref.prettyPrint,prettyPrint=_ref$prettyPrint===undefined?false:_ref$prettyPrint,_ref$literalObject=_ref.literalObject,literalObject=_ref$literalObject===undefined?false:_ref$literalObject,_ref$useInheritance=_ref.useInheritance,useInheritance=_ref$useInheritance===undefined?false:_ref$useInheritance;
if(!input){
throw new Error('An input file is required.');
}
var data=void 0;
if(_utils2.default.contains(input,/scss/)){var _require$renderSync=
require('node-sass').renderSync({
file:input,
outputStyle:'compressed'}),css=_require$renderSync.css;

data=css.toString();
}else{
data=_utils2.default.readFile(input);
}

var styleSheet=this.toJSS(data,useInheritance);
if(output){
_utils2.default.outputReactFriendlyStyle(styleSheet,output,prettyPrint,literalObject);
}
return styleSheet;
}},{key:'toJSS',value:function toJSS(

stylesheetString){var useInheritance=arguments.length>1&&arguments[1]!==undefined?arguments[1]:false;
var directions=['top','right','bottom','left'];
var changeArr=['margin','padding','border-width','border-radius'];
var numberize=_utils2.default.filterArray(['width','height','font-size','line-height'].concat(directions),useInheritance?_inheritance.numeric:[]);

var specialProperties={};
['border','border-top','border-right','border-bottom','border-left'].forEach(function(name){
specialProperties[name]={
regex:/^\s*([0-9]+)(px)?\s+(solid|dotted|dashed)?\s*([a-z0-9#,\(\)\.\s]+)\s*$/i,
map:{
1:name+'-width',
3:name=='border'?name+'-style':null,
4:name+'-color'}};


});

directions.forEach(function(dir){
numberize.push('border-'+dir+'-width');
changeArr.forEach(function(prop){
numberize.push(prop+'-'+dir);
});
});


var directionMaps={
'border-radius':{
'Top':'top-left',
'Right':'top-right',
'Bottom':'bottom-right',
'Left':'bottom-left'}};





function directionToPropertyName(property,direction){
var names=property.split('-');
names.splice(1,0,directionMaps[property]?directionMaps[property][direction]:direction);
return(0,_toCamelCase2.default)(names.join('-'));
}




var unsupported=['display'];var _ParseCSS=

(0,_cssParse2.default)(_utils2.default.clean(stylesheetString)),stylesheet=_ParseCSS.stylesheet;

var JSONResult={};

for(var _iterator=stylesheet.rules,_isArray=Array.isArray(_iterator),_i=0,_iterator=_isArray?_iterator:_iterator[typeof Symbol==='function'?Symbol.iterator:'@@iterator']();;){var _ref2;if(_isArray){if(_i>=_iterator.length)break;_ref2=_iterator[_i++];}else{_i=_iterator.next();if(_i.done)break;_ref2=_i.value;}var rule=_ref2;
if(rule.type!=='rule'){
continue;
}var _loop=function _loop(_selector){


if(!useInheritance){
_selector=_selector.replace(/\.|#/g,'').trim();
}

var styles=JSONResult[_selector]=JSONResult[_selector]||{};var _loop2=function _loop2(

declaration){

if(declaration.type!=='declaration'){
return'continue';
}

var value=declaration.value;
var property=declaration.property;

if(specialProperties[property]){
var special=specialProperties[property],
matches=special.regex.exec(value);
if(matches){
if(typeof special.map==='function'){
special.map(matches,styles,rule.declarations);
}else{
for(var key in special.map){
if(matches[key]&&special.map[key]){
rule.declarations.push({
property:special.map[key],
value:matches[key],
type:'declaration'});

}
}
}
return'continue';
}
}

if(_utils2.default.arrayContains(property,unsupported)){
return'continue';
}

if(_utils2.default.arrayContains(property,numberize)){
styles[(0,_toCamelCase2.default)(property)]=parseFloat(value.replace(/px|\s*/g,''));
}else

if(_utils2.default.arrayContains(property,changeArr)){

values=value.replace(/px/g,'').split(/[\s,]+/);

values.forEach(function(value,index,arr){
arr[index]=parseInt(value);
});

length=values.length;

if(length===1){

styles[(0,_toCamelCase2.default)(property)]=values[0];

}

if(length===2){var _arr=

['Top','Bottom'];for(var _i4=0;_i4<_arr.length;_i4++){var prop=_arr[_i4];
styles[directionToPropertyName(property,prop)]=values[0];
}var _arr2=

['Left','Right'];for(var _i5=0;_i5<_arr2.length;_i5++){var _prop=_arr2[_i5];
styles[directionToPropertyName(property,_prop)]=values[1];
}
}

if(length===3){var _arr3=

['Left','Right'];for(var _i6=0;_i6<_arr3.length;_i6++){var _prop2=_arr3[_i6];
styles[directionToPropertyName(property,_prop2)]=values[1];
}

styles[directionToPropertyName(property,'Top')]=values[0];
styles[directionToPropertyName(property,'Bottom')]=values[2];
}

if(length===4){
['Top','Right','Bottom','Left'].forEach(function(prop,index){
styles[directionToPropertyName(property,prop)]=values[index];
});
}
}else
{
if(!isNaN(declaration.value)&&property!=='font-weight'){
declaration.value=parseFloat(declaration.value);
}

styles[(0,_toCamelCase2.default)(property)]=declaration.value;
}};for(var _iterator3=rule.declarations,_isArray3=Array.isArray(_iterator3),_i3=0,_iterator3=_isArray3?_iterator3:_iterator3[typeof Symbol==='function'?Symbol.iterator:'@@iterator']();;){var _ref4;if(_isArray3){if(_i3>=_iterator3.length)break;_ref4=_iterator3[_i3++];}else{_i3=_iterator3.next();if(_i3.done)break;_ref4=_i3.value;}var declaration=_ref4;var _ret2=_loop2(declaration);if(_ret2==='continue')continue;
}selector=_selector;};for(var _iterator2=rule.selectors,_isArray2=Array.isArray(_iterator2),_i2=0,_iterator2=_isArray2?_iterator2:_iterator2[typeof Symbol==='function'?Symbol.iterator:'@@iterator']();;){var _ref3;if(_isArray2){if(_i2>=_iterator2.length)break;_ref3=_iterator2[_i2++];}else{_i2=_iterator2.next();if(_i2.done)break;_ref3=_i2.value;}var selector=_ref3;var values;var length;_loop(selector);
}
}
return useInheritance?(0,_inheritance2.default)(JSONResult):JSONResult;
}}]);return ReactNativeCss;}();exports.default=ReactNativeCss;