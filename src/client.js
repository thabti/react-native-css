import ReactNative from "react-native";
import css,{register,unregister} from "./css";
import wrap from "./wrap";

//These are all the components in react native to wrap with the styled proxy component
const componentsToWrap = ["ActivityIndicator",
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


const StyledComponents = {};
let wrappedComponents = {};
//wrap all the UI components in React Native
componentsToWrap.forEach(name=> {
  Object.defineProperty(StyledComponents, name, {
    get(){
      return wrappedComponents[name] || (wrappedComponents[name] = wrap(name, ReactNative[name]));
    }
  });
});

//Proxy all other APIs, etc. so it can be a drop-in replacement for import {...} from 'react-native.  All properties
// use a getter so APIs are only initialized when explicitly imported
Object.keys(ReactNative).forEach(name=> {
  if (componentsToWrap.indexOf(name) === -1) {
    Object.defineProperty(StyledComponents, name, {
      get(){
        return ReactNative[name];
      }
    });
  }
});

//Add in all the utility functions
StyledComponents.unregister = unregister;
StyledComponents.register = register;
StyledComponents.css = css;
StyledComponents.wrap = wrap;

module.exports = StyledComponents;
