Object.defineProperty(exports,"__esModule",{value:true});exports.matchingRules=exports.unregister=exports.register=undefined;var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _reactNative=require("react-native");
//The flattened reference object of all the styles. Note that since all styles are passed via StyleSheet.create
// references, duplicate selectors replace previous ones instead of merging.  This is a major difference from standard
// CSS behavior.
var styles={},
//This is an object containing all the rules in the styles sheets for matching against
ruleKeys={},
//This is all the sheets, which is maintained for allowing unregister to work.
sheets=[],
//Cache for matching styles against a given path.
styleCache={};
/**
 // Format of ruleKeys
 ruleKeys = {
  //last element in selector, e.g. 'view .someClass text' would be added to the 'text' array of rules.  If the last
  // element is a class, e.g. 'view .someClass', the element is '*' meaning it matches all elements as that is implicit
  // in the selector 'view *.someClass'.  This is intended for faster look-ups.
  '[element|*]': [
    {
      c: ['someClass'],
      //Order in the stylesheet orders of matching specificity are treated in a last wins matter
      o: 0,
      //The specificity calculation, the more specific the selector, the higher the priority. After matching rules are
      // found, they are sorted according to 's' and then 'o'
      s: 10,
      //this is if the selector has ancestor(s). if immediate, this will fail if the immediate parent does have this
      a: [{e: 'view', i: true,ps:['last-child'], c: ['someClass']}]
    }
  ]
}
 */

/**
 * Pseudo class selectors
 * @type {*[]}
 */
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


/**
 * Takes the flattened style sheet and creates the rules based on the selector declarations.  This is automatically
 * called by flattenSheets.
 * @param {styles} styles
 * @return {ruleKeys}
 */
function createRules(styles){
var rules={};
//root view>text.hello text
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
//prep pseudo functions
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
//Calculate specificity
var specificity=0;
//add +10 for classes
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

/**
 * Test to see if the target matches the matching element.  Compares element type and classes.  The target must have
 * all the classes in matching, but can have more.
 * @param target
 * @param matching
 * @return {boolean}
 */
function elementMatches(target,matching){
if(target.e!==matching.e&&matching.e!=="*"){
return false;
}
if(matching.c&&!matching.c.every(function(className){return target.c&&target.c.indexOf(className)>-1;})){
return false;
}
return!matching.ps||matching.ps.every(function(match){return match(target);});
}

/**
 * Finds all the rules that match the passed path, sorted by specificity asc.
 * @param {[{e:String,c:[String],p:{},i:Number,f:Boolean,l:Boolean}]} path
 * @return {[String]} Array of references to StyleSheets
 */
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


//find matching
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
//push the path up to the next matching
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
//sort styles by specificity and then by order in style sheet so that the highest specificity is the last rule,
// overwriting any previous rules
matchingStyles.sort(function(rule1,rule2){return rule1.s-rule2.s||rule1.o-rule2.o;});
styleCache[key]=_reactNative.StyleSheet.flatten(matchingStyles.map(function(rule){return styles[rule.k+"&inherited"];}).concat(matchingStyles.map(function(rule){return styles[rule.k];})).filter(function(rule){return rule;}));
return styleCache[key];
}catch(e){
return[];
}
}

/**
 * Converts the passed arguments to a style array which can be set into the style prop in a React component
 * @param {[[]|String,{]} args
 * @return {*}
 */
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

/**
 * Flattens all the registerd sheets into the style object and updates ruleKeys with the declarations
 */
function flattenSheets(){
styles=Object.assign.apply(null,[{}].concat(sheets));
ruleKeys=createRules(styles);
}

/**
 * Registers the passed style sheets to be used against the CSS method and wrapped StyledComponents
 * @param {...StyleSheet} stylesheets
 */
function register(){
sheets.push.apply(sheets,arguments);
flattenSheets();
}

/**
 * Removes the stylesheets from the style component.  This is useful for changing themes while using the application or
 * activating style settings for things like accessibility.
 * @param stylesheets
 */
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