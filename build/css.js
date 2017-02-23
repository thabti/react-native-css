Object.defineProperty(exports,"__esModule",{value:true});exports.matchingRules=exports.unregister=exports.register=undefined;var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _reactNative=require("react-native");



var styles={},

ruleKeys={},

sheets=[],

styleCache={};

























var pseudos=[
{
regex:/^first-child$/i,
match:function match(matches,element){return element.f;}},

{
regex:/^last-child$/i,
match:function match(matches,element){return element.l;}},

{
regex:/^nth-child\(([0-9]+)\)$/i,
match:function match(matches,element){return element.i==matches[1];}},

{
regex:/^not\(([a-z0-9\-\._]+)\)$/i,
match:function match(matches,element){
return matches[1].split(".").filter(function(a){return a;}).every(function(className){return element.c.indexOf(className)===-1;});
}}];








function createRules(styles){
var rules={};

Object.keys(styles).forEach(function(key,o){
if(key.endsWith("&inherited")){
return;
}
var path=[];
key.replace(/\s*>\s*/g,">").replace(/\s+/g," ").split(" ").forEach(function(part){
var immediates=part.split(">");
immediates.forEach(function(immediate,i){
var pseudo=immediate.split(":"),
normal=pseudo.shift(),
classes=normal.split(".").filter(function(a){return a;}),
element=normal.charAt(0)==="."?"*":classes.shift();

pseudo=pseudo.map(function(pseudo){return pseudos.find(function(test){return test.regex.exec(pseudo);});}).filter(function(test){return test;}).map(function(test){
var matches=test.regex.exec(pseudo);
if(matches){
return test.match.bind(null,matches);
}
}).filter(function(ps){return ps;});

path.push({
e:element,
c:classes,
ps:pseudo.length&&pseudo,
i:immediates.length>0&&i!=immediates.length-1});

});
});
path=path.reverse();
var first=path.shift();

var specificity=0;

specificity+=first.c.length*10;
if(path.length>0&&path.i){
specificity+=5;
}
if(first.e!=="*"){
specificity++;
}

path.forEach(function(a){
specificity+=a.c.length;
});

if(!rules[first.e]){
rules[first.e]=[];
}
rules[first.e].push(_extends({},first,{a:path,s:specificity,o:o,k:key}));
});
return rules;
}








function elementMatches(target,matching){
if(target.e!==matching.e&&matching.e!=="*"){
return false;
}
if(matching.c&&!matching.c.every(function(className){return target.c&&target.c.indexOf(className)>-1;})){
return false;
}
return!matching.ps||matching.ps.every(function(match){return match(target);});
}






function matchingRules(path,key){
try{
if(!key){
key=JSON.stringify(path);
}
if(styleCache[key]){
return styleCache[key];
}

path=path.slice(0).reverse();
if(!path[0]){
return styleCache[key]=null;
}
var element=path[0].e;



var starting=(ruleKeys[element]||[]).concat(ruleKeys["*"]||[]);
var matchingStyles=starting.filter(function(rule){
if(!elementMatches(path[0],rule)){
return;
}
var index=1,lastRelative=-1;
return rule.a.every(function(ancestor,i){
main:for(;index<path.length;index++){
if(elementMatches(path[index],ancestor)){
if(!ancestor.i){
lastRelative=i;
}
index++;
return true;
}else if(ancestor.i){
if(lastRelative>-1){

index++;
var ancestors=rule.a.slice(lastRelative,i-1),
directAncestor=ancestor.shift();
for(;index<path.length;index++){
if(elementMatches(path[index],directAncestor)){
directAncestor=ancestors.shift();
if(!directAncestor){
continue main;
}
}
}
}
return false;
}
}
});
});


matchingStyles.sort(function(rule1,rule2){return rule1.s-rule2.s||rule1.o-rule2.o;});
styleCache[key]=_reactNative.StyleSheet.flatten(matchingStyles.map(function(rule){return styles[rule.k+"&inherited"];}).concat(matchingStyles.map(function(rule){return styles[rule.k];})).filter(function(rule){return rule;}));
return styleCache[key];
}catch(e){
return[];
}
}






function css(){for(var _len=arguments.length,args=Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}
var first=args[0];
return args.map(function(arg){
if(arg instanceof Array){
return matchingRules(arg);
}else if(typeof arg==="string"){
if(arg.charAt(0)==="&"){
first=arg=first+"."+arg.substr(1);
}
return[];
}else{
return arg;
}
});
}




function flattenSheets(){
styles=Object.assign.apply(null,[{}].concat(sheets));
ruleKeys=createRules(styles);
}





function register(){
sheets.push.apply(sheets,arguments);
flattenSheets();
}






function unregister(){for(var _len2=arguments.length,stylesheets=Array(_len2),_key2=0;_key2<_len2;_key2++){stylesheets[_key2]=arguments[_key2];}
stylesheets.forEach(function(sheet){
var index=sheets.indexOf(sheet);
if(index>-1){
sheets.splice(index,1);
}
});
flattenSheets();
}exports.default=

css;exports.
register=register;exports.unregister=unregister;exports.matchingRules=matchingRules;