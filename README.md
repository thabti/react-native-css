
# NOTE
this module is still in development and is not something for everyone.

## 24 April

version `1.1.4` brings sass support, so you can have variables, partials, and more.


# react-native-css

Write modular SCSS or basic CSS styles for your React-Native components and application. react-native-css turns valid CSS into the Facebook subset of CSS styling.


```bash
npm install react-native-css --save 
```
# Come again?

React-native-css comes with a cli and you can watch a file and compile it.

``` shell
./node_modules/.bin/react-native-css -i INPUT_CSS_FILE -o OUTPUT_JS_FILE -w `
```

ok real example:

``` shell
./node_modules/.bin/react-native-css -i style.scss -o style.js -w
```
or

``` shell
./node_modules/.bin/react-native-css -i style.css -o style.js -w
```
## why a cli?

React-native-cli doesn't use the node module ecosystem. The basic setup up is to have react-native running on one terminal, and the react-native-css on another. React-native-css will watch for changes and compile back to javascript.
![the workflow](http://i.imgur.com/i2OdwiY.png)

# what?

css

``` css
description {
  margin-Bottom: 20;
  font-size: 18;
  text-align: center;
  color: #656656;
}

container {
  padding: 30;
  margin-Top: 65;
  align-items: center;
}

```

or

Sass
``` css
@import 'base/colors';

description {
  margin-Bottom: 20;
  font-size: 18;
  text-align: center;
  color: $mainTextColor;
}

container {
  padding: 30;
  margin-Top: 65;
  align-items: center;
}

```

to

``` json
{"description":{"marginBottom":20,"fontSize":18,"textAlign":"center","color":"#656656"},"container":{"padding":30,"marginTop":65,"alignItems":"center"}}

```

then a module file is generated

``` javascript
// style.js
module.exports = require('react-native').StyleSheet.create(
  {"description":{"marginBottom":20,"fontSize":18,"textAlign":"center","color":"#656656"},"container":{"padding":30,"marginTop":65,"alignItems":"center"}}
  );
```

# then?
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

#Todo

* support multiple outputs
* support for custom output directory (if needed);
