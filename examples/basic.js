// ./components/MyComponent.js
import React,{Component} from 'react'
//use react-native-css as a drop-in replacement for react-native
import {View,Text,TouchableOpacity,register,wrap,map} from 'react-native-css'

//register your stylesheet(s).  Just do this at the entry point to your app, such as index.ios.js

register(require('../styles/default.js'), require('../styles/dark_theme.js'))


class MyComponent extends Component {
  render() {
    return (
      <View className="my-component">
        <Text>This is some text that will be automatically styled with text element selector (.my-component text {'{...}'}).</Text>
      </View>
    );
  }
}

export default MyComponent

//Using wrap to create a component that allows className property

class MyComponent extends Component {
  render() {
    //this is critical, as the style prop will be populated from the className assigned by this component's owner
    let {style} = this.props;
    return (
      <View style={style}>
        <Text>This is some text that will be automatically styled with text element selector (MyComponentsElementSelectorName text {'{...}'}).</Text>
      </View>
    );
  }
}

export default wrap('MyComponentsElementSelectorName', MyComponent)


//Using a pass-through className, not using MyComponent as a styled component.
//MyComponent will NOT be in the selector path.

class MyComponent extends Component {
  render() {
    //You can allow both style and className to pass-through.  Inline styles will overwrite any class styles, just like in the browser.
    let {style,className} = this.props;
    return (
      <View style={style} className={['my-component',className]}>
        <Text>This is some text that will be automatically styled with text element selector (.my-component text {'{...}'}).</Text>
      </View>
    );
  }
}

export default MyComponent

//Enable :last-child,:first-child and :nth-child(n) selectors using map([Component])

class MyComponent extends Component {
  state = {
    someActiveFlag:false
  };

  render() {
    let {someActiveFlag} = this.state
    //className is different from standard React as it accepts a string or an array or strings.  This is just some sugar to avoid the annoyance of string concatenation.
    //Here we can do a short circuit for the 'active' class and let the library do the ugly work.
    return (
      <View className={['my-component',someActiveFlag && 'active']}>
        {//map will automatically add keys (index) if not set. This is fine for static arrays, however set keys for dynamic children to prevent state issues.
          map([
            <Text>This is some text that will be automatically styled with text element selector (.my-component text:first-child {'{...}'}).</Text>,
            <Text>This is some text that will be automatically styled with text element selector (.my-component text:nth-child(2) {'{...}'}).</Text>,
            <Text>This is some text that will be automatically styled with text element selector (.my-component text:last-child {'{...}'}).</Text>
          ])
          //just wrap an Array#map() call to get functionality on a dynamic set, e.g. map(someArray.map(item=><Component .../>))
        }
        <TouchableOpacity onPress={()=>this.setState({someActiveFlag:true})}>
          <View>
            <Text>
              Yep, you can use "touchableOpacity text {'{...}'}".  Selectors are not case-sensitive, so "TOUCHABLEOPACITY view TEXT" is treated
              {' '}the same as "TouchableOpacity view Text". This is the same as standard CSS.
            </Text>
            <Text>You can target the parent View as well, e.g. "TouchableOpacity view".</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default MyComponent


