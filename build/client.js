var _reactNative=require("react-native");var _reactNative2=_interopRequireDefault(_reactNative);
var _css=require("./css");var _css2=_interopRequireDefault(_css);
var _wrap=require("./wrap");var _wrap2=_interopRequireDefault(_wrap);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}

//These are all the components in react native to wrap with the styled proxy component
var componentsToWrap=["ActivityIndicator",
"ActivityIndicatorIOS",
"ART",
"DatePickerIOS",
"DrawerLayoutAndroid",
"Image",
"ImageEditor",
"ImageStore",
"KeyboardAvoidingView",
"ListView",
"MapView",
"Modal",
"Navigator",
"NavigatorIOS",
"Picker",
"PickerIOS",
"ProgressBarAndroid",
"ProgressViewIOS",
"ScrollView",
"SegmentedControlIOS",
"Slider",
"SliderIOS",
"SnapshotViewIOS",
"Switch",
"RecyclerViewBackedScrollView",
"RefreshControl",
"StatusBar",
"SwipeableListView",
"SwitchAndroid",
"SwitchIOS",
"TabBarIOS",
"Text",
"TextInput",
"ToastAndroid",
"ToolbarAndroid",
"Touchable",
"TouchableHighlight",
"TouchableNativeFeedback",
"TouchableOpacity",
"TouchableWithoutFeedback",
"View",
"ViewPagerAndroid",
"WebView"];


var StyledComponents={};
var wrappedComponents={};
//wrap all the UI components in React Native
componentsToWrap.forEach(function(name){
Object.defineProperty(StyledComponents,name,{
get:function get(){
return wrappedComponents[name]||(wrappedComponents[name]=(0,_wrap2.default)(name,_reactNative2.default[name]));
}});

});

//Proxy all other APIs, etc. so it can be a drop-in replacement for import {...} from 'react-native.  All properties
// use a getter so APIs are only initialized when explicitly imported
Object.keys(_reactNative2.default).forEach(function(name){
if(componentsToWrap.indexOf(name)===-1){
Object.defineProperty(StyledComponents,name,{
get:function get(){
return _reactNative2.default[name];
}});

}
});

//Add in all the utility functions
StyledComponents.unregister=_css.unregister;
StyledComponents.register=_css.register;
StyledComponents.css=_css2.default;
StyledComponents.wrap=_wrap2.default;

module.exports=StyledComponents;