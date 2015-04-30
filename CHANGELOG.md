#1.1.5
* support for padding to be written in the css manner:
``` css
test  {
	padding: 1, 2, 3, 4
}
```

React-Native-CSS will convert it to:

``` javascript
   "test": {
        "paddingLeft": 2,
        "paddingRight": 2,
        "paddingTop": 1,
        "paddingBottom": 3
    }
```

#1.1.4
 
 * SASS support