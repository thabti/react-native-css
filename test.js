var styeact = require('./index');

var result = styeact('./stylesheet.css', function(data) {
  console.log(data)
});

console.log(result)
