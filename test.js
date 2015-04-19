var styeact = require('./index');
// promise way
styeact('./stylesheet.css').then(function json(data) {
  console.log(data);
}, function error(err) {
  console.log(err);
})
