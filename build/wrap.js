Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();exports.default=

















































wrap;var _react=require("react");var _react2=_interopRequireDefault(_react);var _css=require("./css");var _css2=_interopRequireDefault(_css);var _shallowCompare=require("react/lib/shallowCompare");var _shallowCompare2=_interopRequireDefault(_shallowCompare);var _hoistNonReactStatics=require("hoist-non-react-statics");var _hoistNonReactStatics2=_interopRequireDefault(_hoistNonReactStatics);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i<arr.length;i++){arr2[i]=arr[i];}return arr2;}else{return Array.from(arr);}}var isWebApp=false;try{//Check if this is actually in the browser, this is probably leveraging react-native-web and allows for sharing
// styled components between web and native apps.
/* eslint no-undef: "off" */if(typeof window.document.getElementById==="function"){isWebApp=true;}}catch(e){//looks like pure React Native
}function normalizeClassNames(classNames){var classes=[];if(typeof classNames==="string"){classes=classNames.split(" ").filter(function(a){return a;});}else if(classNames instanceof Array){classNames.forEach(function(name){var _classes;(_classes=classes).push.apply(_classes,_toConsumableArray(normalizeClassNames(name)));});}return classes;}function indexOf(instance,children){var index=0;for(var key in children){if(children[key]._mountOrder===instance._reactInternalInstance._mountOrder){return index;}index++;}return-1;}var pathCache={};/**
 * Takes the passed component and wraps it in a styled proxy.  All props are passed through.
 * Path information is handled via Context, so be careful not to override the 'path' context value.
 * @param {string} name Name that will be used in CSS selectors, case insensitive.
 * @param {Component} WrappedComponent
 * @return {Component}
 */function wrap(name,WrappedComponent){if(isWebApp){//Since the whole point of this is to mimic CSS rules from the browser, just simply return the component in a web
// environment, no wrapping necessary.
return WrappedComponent;}var StyledComponent=function(_Component){_inherits(StyledComponent,_Component);function StyledComponent(){_classCallCheck(this,StyledComponent);return _possibleConstructorReturn(this,Object.getPrototypeOf(StyledComponent).apply(this,arguments));}_createClass(StyledComponent,[{key:"componentWillReceiveProps",value:function componentWillReceiveProps(nextProps){if((0,_shallowCompare2.default)(this,nextProps)){this.cssPathKey=null;}
}

//This is the magic right here.
},{key:"getChildContext",value:function getChildContext(){
var self=this;
return{
get cssPath(){
if(!self.cssPath){
self.createPath(self.props);
}
return self.cssPath;
},
get cssPathKey(){
if(!self.cssPath){
self.createPath(self.props);
}
return self.cssPathKey;
}};

}},{key:"setNativeProps",value:function setNativeProps(





















nativeProps){
this._root&&this._root.setNativeProps(nativeProps);
}},{key:"shouldComponentUpdate",value:function shouldComponentUpdate(

nextProps){
return(0,_shallowCompare2.default)(this,nextProps);
}

/**
     * This updates the path and style with the latest props
     * @param props
     */},{key:"createPath",value:function createPath(
props){
var index=-1,
count=1;
if(this._reactInternalInstance&&this._reactInternalInstance._hostParent){
var children=this._reactInternalInstance._hostParent._renderedChildren;
count=Object.keys(children).length;
index=indexOf(this,children);
}
var element={
e:name.toLowerCase(),
c:normalizeClassNames(props.className),
//Maybe in the future, but is it worth the performance hit?
//        p: props,
i:index,
f:index===0,
l:count===index+1};

var key=(this.context.cssPathKey||"")+">"+element.e+"."+element.c.join(".")+":"+(element.i||"")+":"+(element.f||"")+":"+(element.l||"");
if(this.cssPathKey!==key){
//Create the path or use the cache.  Since this can be called thousands of times, the cache reduces the more
// expensive array generations and reduces memory consumption by resusing arrays. Because of this it is
// important that the arrays are treated as immutable.
this.cssPath=pathCache[key]||(pathCache[key]=(this.context.cssPath||[{e:"root"}]).concat([element]));
this.cssPathKey=key;
}
}},{key:"render",value:function render()

{var _this2=this;
return _react2.default.createElement(WrappedComponent,_extends({},this.props,{ref:function ref(_ref){return _this2._root=_ref;},
style:this.props.style?[this.styles,this.props.style]:this.styles}));
}},{key:"pathKey",get:function get(){if(!this.cssPathKey||this.context.cssPathKey!==this._lastPathKey){this.createPath(this.props);this._lastPathKey=this.context.cssPathKey;}return this.cssPathKey;}},{key:"styles",get:function get(){if(!this.style||this._lastKey!==this.pathKey){if(!this.cssPath){this.createPath(this.props);}var style=(0,_css.matchingRules)(this.cssPath,this.cssPathKey);this.style=this.props.style?(0,_css2.default)(style,this.props.style):style;this._lastKey=this.pathKey;}return this.style;}}]);return StyledComponent;}(_react.Component);


(0,_hoistNonReactStatics2.default)(StyledComponent,WrappedComponent);
StyledComponent.WrappedComponent=WrappedComponent;
StyledComponent.displayName=name;
StyledComponent.childContextTypes={
cssPath:_react2.default.PropTypes.array,
cssPathKey:_react2.default.PropTypes.string};

//Make sure we are getting our parent's path
StyledComponent.contextTypes={cssPath:_react2.default.PropTypes.array,cssPathKey:_react2.default.PropTypes.string};
return StyledComponent;
}