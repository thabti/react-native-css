

# react-native-css

write css and use it within your react-native application. Ok basically it turns valid css into JSON, which you can use in your app.


# NOTE
this module is still in development


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
./node_module/.bin/react-native-css -i style.css -o style.js -w
```
## why a cli?

React-native-cli doesn't use the node module ecosystem. So run react-native on one tab and have this running and watching in another.

# what?

``` css
description {
  margin-Bottom: 20;
  fontSize: 18;
  textAlign: center;
  color: #656656;
}

container {
  padding: 30;
  margin-Top: 65;
  alignItems: center;
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
var styles = require('./stye.js')
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
