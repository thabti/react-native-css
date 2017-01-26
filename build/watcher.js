require('babel-polyfill');
var _index=require('./index');var _index2=_interopRequireDefault(_index);
var _fs=require('fs');var _fs2=_interopRequireDefault(_fs);
var _request=require('request');var _request2=_interopRequireDefault(_request);
var _chokidar=require('chokidar');var _chokidar2=_interopRequireDefault(_chokidar);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}

console.log('started watcher');

var css=new _index2.default();

/**
 * Checks if the packager is running, if not there really isn't point of keeping this thing alive.
 * @return {Promise}
 */
function isServerRunning(){return regeneratorRuntime.async(function isServerRunning$(_context){while(1){switch(_context.prev=_context.next){case 0:return _context.abrupt('return',
new Promise(function(resolve){return(0,_request2.default)('http://localhost:8081/status',function(err,response,body){
resolve(body==="packager-status:running");
});}));case 1:case'end':return _context.stop();}}},null,this);}


function run(){var _this=this;var input,output,name,pidFile,











check,watcher;return regeneratorRuntime.async(function run$(_context3){while(1){switch(_context3.prev=_context3.next){case 0:check=function check(){
try{
return process.kill(~~_fs2.default.readFileSync(pidFile,'utf8'),0);
}
catch(e){
return e.code==='EPERM';
}
};input=process.argv[2],output=process.argv[3];if(!(!input||!output)){_context3.next=4;break;}return _context3.abrupt('return');case 4://check pid
name=input.replace(/[^0-9a-z]/g,''),pidFile='/tmp/rnc_watch_'+name+'.pid';if(!
check()){_context3.next=7;break;}return _context3.abrupt('return',
process.exit(0));case 7:


_fs2.default.writeFileSync(pidFile,process.pid,'utf8');

//check if server is up
_context3.next=10;return regeneratorRuntime.awrap(isServerRunning());case 10:if(_context3.sent){_context3.next=13;break;}
console.warn('Server isn\'t running.');return _context3.abrupt('return',
process.exit(0));case 13:


watcher=_chokidar2.default.watch(input,{
ignored:/[\/\\]\./,persistent:true}).
on('change',function(){
css.parse({input:input,output:output,useInheritance:true});
});

setInterval(function _callee(){return regeneratorRuntime.async(function _callee$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:_context2.next=2;return regeneratorRuntime.awrap(
isServerRunning());case 2:if(_context2.sent){_context2.next=4;break;}
process.exit(0);case 4:case'end':return _context2.stop();}}},null,_this);},

10000);case 15:case'end':return _context3.stop();}}},null,this);}




run();