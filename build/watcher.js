require('babel-polyfill');
var _index=require('./index');var _index2=_interopRequireDefault(_index);
var _fs=require('fs');var _fs2=_interopRequireDefault(_fs);
var _request=require('request');var _request2=_interopRequireDefault(_request);
var _chokidar=require('chokidar');var _chokidar2=_interopRequireDefault(_chokidar);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}

var css=new _index2.default();





function isServerRunning(){
return new Promise(function(resolve){return(0,_request2.default)('http://localhost:8081/status',function(err,response,body){
resolve(body==="packager-status:running");
});});
}

function run(){var _this=this;var input,output,name,pidFile,











check;return regeneratorRuntime.async(function run$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:check=function check(){
try{
return process.kill(~~_fs2.default.readFileSync(pidFile,'utf8'),0);
}
catch(e){
return e.code==='EPERM';
}
};input=process.argv[2],output=process.argv[3];if(!(!input||!output)){_context2.next=4;break;}return _context2.abrupt('return');case 4:name=input.replace(/[^0-9a-z]/g,''),pidFile='/tmp/rnc_watch_'+name+'.pid';if(!

check()){_context2.next=7;break;}return _context2.abrupt('return',
process.exit(0));case 7:


_fs2.default.writeFileSync(pidFile,process.pid,'utf8');_context2.next=10;return regeneratorRuntime.awrap(


isServerRunning());case 10:if(_context2.sent){_context2.next=12;break;}return _context2.abrupt('return',
process.exit(0));case 12:


_chokidar2.default.watch(input,{
ignored:/[\/\\]\./,persistent:true}).
on('change',function(){
css.parse({input:input,output:output,useInheritance:true});
});

setInterval(function _callee(){return regeneratorRuntime.async(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:_context.next=2;return regeneratorRuntime.awrap(
isServerRunning());case 2:if(_context.sent){_context.next=4;break;}
process.exit(0);case 4:case'end':return _context.stop();}}},null,_this);},

10000);case 14:case'end':return _context2.stop();}}},null,this);}




run();