# Using Styled Components (className for React Native!)
Using Styled Components let you introduce CSS-like styling to your React Native Project, no longer needing to added explicit *style* properties.  Styled components support component names and class names using the same **className** property found in standard React.  Additionally Text styles can be inherited from non-Text container styles, meaning you no longer need to explicitly set *fontSize*, *textAlign*, etc. on each desired Text component.

- [Setup](#setup) 
- [Usage](#usage)
	- [Create your stylesheet](#create-your-stylesheet)
	- [Converting your stylesheet](#converting-your-stylesheet)
	- [Register your stylesheet](#register-your-stylesheet)
	- [Usage examples](#usage-examples)
- [Quirks](#quirks)
	- [Text](#text)
	- [Specificity](#specificity)
	- [className](#classname)
	- [:first-child, :last-child, :nth-child(n)](#classname)
	- [Running in the browser](#running-in-the-browser)
- [Behind the Curtain](#behind-the-curtain)
	- [Rules](#rules)
	- [Internal Path](#internal-path)
- [Performance](#performance)

## Setup
You'll need to add *react-native-css* to your project.  It's that hard.

```shell
npm i --save react-native-css
```

## Usage
You can use the wrapped style components instead of those out of the `react-native`.  They are simple just thinly wrapped, pass-through versions of the native components and should behave just like the non-wrapped versions.

### Create your stylesheet
You create your CSS styles normally, however remember that React Native only supports a small subset of style properties that can be mapped to CSS. See  [http://facebook.github.io/react-native/docs/view.html#style](http://facebook.github.io/react-native/docs/view.html#style) for more information.
Also, only a small subset of selectors are supported.  Components (including `*`), classes, child (`>`), `:not(.className)`,`:first-child`, `:nth-child(n)` and `:last-child` are supported.
There is currently **no** support for siblings (`+`,`~`), props (`[name="value"]`) or the myriad of pseudo-class selectors.

Also, styles for text must be in a selector that terminates in a text component (compound selectors are okay, e.g. `text.someClass:first-child`). This is because text styles are filtered out of all other selectors when the CSS is converted.

```sass
//default.scss
//All that SASS/SCSS goodness for React Native
$myAwesomeColor: pink;

//Use root to set app-wide properties, these are really only text properties.
root {
  //This will get inherited by all text properties.
  font-size: 18px;
  color: #232;
}

.my-component text {
  //This will take precedence over the text {...} rule
  font-size: 22px;
  color: $myAwesomeColor;
  &:last-child {
    font-weight: bold;
  }
}

//You need to explicitly style a text component for text properties to apply
text.someTextClass {
  font-size:20px;
}

//IMPORTANT: Make sure to use text element selectors whenever styling text.
//Any text properties in rules not ending with a text selector will be stripped out.
//This allows for inheritance without stuffing text only properties into other views.
text {
  //this will be used over the root size, making the root declaration pointless.
  font-size: 16px;
}

MyComponentsElementSelectorName text {
  color: red;
}

TouchableOpacity {
  padding: 5px;
  margin: 5px;
  view text {
    color: blue;
  }
}

TouchableHighlight {
  @extend TouchableOpacity; //Just love the SASS, waaaay better than fiddling with JavaScript objects
  margin: 10px;
  border: 1px rgba(0, 0, 0, .5);
}

//:not(.closs1.class2...) is supported.  Only class selectors are supported.
view:not(.aClassName) {
  //This will be automatically expanded to the proper paddingTop, paddingRight, etc. styles.
  padding: 10px 20px;
}

```

### Converting your stylesheet
You'll need to run the `react-native-css` command to convert your stylesheets to the *React Native* StyleSheet format. In order to leverage the styled components, you will need to run it with the `--inherit` flag.

```shell
react-native-css -i default.scss -o default.js --watch --inherit
```

### Register your stylesheet
Add your file(s) you generated from the `react-native-css` command to the entry point of your application, e.g. *index.ios.js*.  Stylesheets are global objects and are set for the entire application.

```javascript
//index.ios.js
import {register} from 'react-native-css'
... other imports
register(require('./styles/default.js'), require('./styles/ios_theme.js'))

```

### Usage examples

```javascript
//MyComponent.js
import React,{Component} from 'react'
//use react-native-css as a drop-in replacement for react-native
import {View,Text,TouchableOpacity,wrap} from 'react-native-css'

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
        <Text>This is some text that will be automatically styled with text element selector (.my-component text:first-child {'{...}'}).</Text>
        <Text>This is some text that will be automatically styled with text element selector (.my-component text:nth-child(2) {'{...}'}).</Text>
        <Text>This is some text that will be automatically styled with text element selector (.my-component text:last-child {'{...}'}).</Text>
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
```

## Quirks
The main thing to remember is that all the rules are generated at build time, which means the build script must know all the relevant information desired to be included during runtime.  The biggest note is on `Text` components as they must be explicitly added to the CSS selector path. 

### Text
You must either use `text`, `text.className` or `.className:text` to specify a rule applies to a Text component.  If you do not specify this, the declared text properties will be filtered out at build time and therefore not applied during run-time.

```css
.some-container .sub-container {
  background-color: #000;
  text-align: center;
}
```

```javascript
//note that because text was not in the selector, it was filtered out
module.exports = require('react-native').StyleSheet.create({
  ".some-container .sub-container": {backgroundColor: "#000"}
})
```

### Specificity
Rules are ordered by how well they match the path of a component and ordered from most general to most specific so that the more specific rules will overrule the values of the more general rules.  This has been implemented to match the rules in standard CSS, however there may be some slight variations.  Additionally if two rules have the same specificity value, the one declared last will take priority.

### className
The *className* property is slightly different than how it implemented in standard React.  Standard React only excepts a string as the value, while this library will accept either a string or an array of strings or string arrays.  If you use this library in a web environment, className is passed unaltered which means you can only pass a string. If you use it in web environments, wrap the className arrays with the `normalizeClassNames` functions which will convert the array into a string.

### Running in the browser
If you plan on using the fantastic *react-native-web* in order to run your React Native app in the browser, you should know that this library becomes a no op meaning any library specific features can't be used.  This is a performance consideration as it is much less expensive to defer to the browsers native CSS operations.  


## Behind the Curtain
It is useful to understand how this system works in order to best take advantage of it.  While not needed in most cases, this can help troubleshoot issues you encounter.

### Rules
After you run `react-native-css ...` on your stylesheets, the styles are defined into a single `StyleSheet.create` object.  At runtime the selectors are then parsed into a path.  This path is used to match against the target component's path.

### Internal Path
The wrapper implements `Component#getChildContext()` and `Component.contextTypes` in order to generate the component's path in the view tree.  Because of this it is important to realize that only wrapped components are counted in the path.  This means that if you use the standard components in your tree, the wrapped components will calculate their path as though their standard parents did not exist.  This typically comes into play when using child selectors (`>`) in your path. 

## Performance
The one major downside of using this method is the performance hit.  The first hit is including all your styles in the StyleSheet, which has to be pushed over the bridge at some point.  This shouldn't be a significant hit, but if you have a lot of styles it could be noticeable.

The second, and the more major, performance hit comes from the extra components in the tree.  Additionally, every wrapper implements both getChildContext() and contextTypes in order to track its position in the tree and has to get the matching styles for that component path.

As with everything, the choice is the trade-off between ease of styling vs performance.  For smaller projects, there shouldn't be a noticeable difference, however if you have a large component tree you might start running into the extra lag.  Hopefully it isn't the bottleneck in your project.

If you experience slower than desired performance, make sure you check your own components and ensure that you are leveraging *shouldComponentUpdate* on all your components.
