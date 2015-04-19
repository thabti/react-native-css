var styeact = require('./index');
// promise way
styeact('./stylesheet.css').then(function json(data) {
  console.log(data);

   var test = (data === '{"description":{"marginBottom":20,"fontSize":18,"textAlign":"center","color":"#656656"},"container":{"padding":30,"marginTop":65,"alignItems":"center"}}')
   console.log('TEST passed? ...', test)
}, function error(err) {
  console.log(err);
})
