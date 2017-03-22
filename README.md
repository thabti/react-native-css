# No Longer under active development. 
Looking for someone to take over and push this project further. 

#### Some ideas:
 - Babel transform
 - High order component wrapper


# react-native-css (and SCSS) [![Circle CI](https://circleci.com/gh/sabeurthabti/react-native-css.svg?style=svg&circle-token=a140907997e6a37c6c5ec75f04e8150cef049ff6)](https://circleci.com/gh/sabeurthabti/react-native-css) [![NPM](https://img.shields.io/npm/dm/react-native-css.svg?style=flat-square)](https://www.npmjs.com/package/react-native-css)

 React-native-css turns valid CSS/SASS into the Facebook subset of CSS.

## Install

Global

```bash
yarn global add react-native-css
```

```bash
npm install react-native-css -g
```

Local

```bash
yarn add react-native-css --dev
```


```bash
npm install react-native-css --dev
```


# Command Line Interface

React-native-css comes with a cli and you can watch a file and compile it.

``` shell
# example 1
react-native-css -i INPUT_CSS_FILE -o OUTPUT_JS_FILE --watch
```

``` shell
# example 2
react-native-css -i INPUT_CSS_FILE -o OUTPUT_JS_FILE --watch --pretty
```

``` shell
# example 3
react-native-css INPUT_CSS_FILE OUTPUT_JS_FILE -w
```

``` shell
react-native-css -i style.css -o style.js -w
```

Flags
- "-w" or "--watch" - watch for changes and recompile.
- "-i" takes a input (optional)
- "-o" takes an output path (optional)
- "-p" or "--pretty" - pretty print the resulting compiled output
- "-l" or "--literal" - generates a javascript literal object without StyleSheet.create wrapper

## Screenshot

![the workflow](http://i.imgur.com/i2OdwiY.png)

# Example

Given the following CSS:

``` css
description {
  margin-bottom: 20px;
  font-size: 18px;
  text-align: center;
  color: #656656;
}

container {
  padding: 30px;
  margin-top: 65px;
  align-items: center;
  display: block;
}

```

React-native-css will generate to the following:

``` javascript
// style.js
module.exports = require('react-native').StyleSheet.create(
  {"description":{"marginBottom":20,"fontSize":18,"textAlign":"center","color":"#656656"},"container":{"padding":30,"marginTop":65,"alignItems":"center"}}
  );
```  
You can make use of --literal argument and instead it will generate:
``` javascript
// style.js
module.exports = {
  "description":{"marginBottom":20,"fontSize":18,"textAlign":"center","color":"#656656"},"container":{"padding":30,"marginTop":65,"alignItems":"center"}
  }
```  

# Usage
```js
// require the generated style file
var styles = require('./style.js')
 //{"description":{"marginBottom":20,"fontSize":18,"textAlign":"center","color":"#656656"},"container":{"padding":30,"marginTop":65,"alignItems":"center"}}


class SearchPage extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.description}>
        Buy
        </Text>

      </View>
    );
  }
}

```
