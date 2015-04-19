# react-native-css

write css and use it within your react-native application. Ok basically it turns valid css into JSON, which you can use in your app.


```bash
npm install react-native-css --save
```


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

# then?
```js

var styles = {"description":{"marginBottom":20,"fontSize":18,"textAlign":"center","color":"#656656"},"container":{"padding":30,"marginTop":65,"alignItems":"center"}}



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
