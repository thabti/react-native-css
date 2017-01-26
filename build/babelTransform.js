Object.defineProperty(exports,"__esModule",{value:true});exports.default=












































function(_ref){var t=_ref.types;
return{
visitor:{
ImportDeclaration:function ImportDeclaration(transformPath,_ref2){var file=_ref2.file;
var resolvePath=transformPath.node.source.value;
if(resolvePath.startsWith('css!')){
resolvePath=resolvePath.substr(4);
var name=resolvePath.replace(/\.\.\/|\.\//g,'').replace(/\//g,'_').split('.')[0];
var absolutePath=_path2.default.resolve(resolvePath),
relativePath=_path2.default.dirname(_path2.default.relative('./',file.opts.filename))+'/_css/'+name+'.js';
startTransform(absolutePath,_path2.default.resolve('./_css/'+name+'.js'));

var expression=t.callExpression(t.memberExpression(t.callExpression(t.identifier('require'),[t.stringLiteral('react-native-css')]),t.identifier('register')),[t.callExpression(t.identifier('require'),[t.stringLiteral(relativePath)])]);
transformPath.replaceWith(expression);
}
}}};


};var _index=require('./index');var _index2=_interopRequireDefault(_index);var _fs=require('fs');var _fs2=_interopRequireDefault(_fs);var _path=require('path');var _path2=_interopRequireDefault(_path);var _child_process=require('child_process');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var css=new _index2.default();function runWatcher(input,output){console.log('starting watcher');var ls=(0,_child_process.spawn)('node',['./watcher.js',input,output],{detached:true,cwd:__dirname});ls.stdout.on('data',function(data){console.log('stdout: '+data);});ls.stderr.on('data',function(data){console.log('stderr: '+data);});ls.on('close',function(code){console.log('child process exited with code '+code);});}function startTransform(input,output){var transformOnly=arguments.length<=2||arguments[2]===undefined?false:arguments[2];console.log('transform');try{_fs2.default.mkdirSync('./_css');}catch(e){}try{css.parse({input:input,output:output,useInheritance:true});}catch(e){console.log('hi');}if(process.env.BABEL_ENV==='development'&&!transformOnly){runWatcher(input,output);}return true;}//