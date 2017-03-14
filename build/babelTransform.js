Object.defineProperty(exports,"__esModule",{value:true});exports.default=
























function(_ref){var t=_ref.types;
return{
visitor:{
ImportDeclaration:function ImportDeclaration(transformPath,_ref2){var file=_ref2.file;
var resolvePath=transformPath.node.source.value;
if(resolvePath.startsWith('css!')){
resolvePath=resolvePath.substr(4);
var name=resolvePath.replace(/\.\.\/|\.\//g,'').replace(/\//g,'_').split('.')[0];
var absolutePath=_path2.default.resolve(_path2.default.dirname(file.opts.filename),resolvePath),
relativePath=_path2.default.dirname(absolutePath)+'/_transformed/'+name+'.js';
startTransform(absolutePath,_path2.default.resolve(relativePath));

var expression=t.callExpression(t.memberExpression(t.callExpression(t.identifier('require'),[t.stringLiteral('react-native-css')]),t.identifier('register')),[t.callExpression(t.identifier('require'),[_path2.default.resolve(relativePath)])]);
transformPath.replaceWith(expression);
}
}}};


};var _index=require('./index');var _index2=_interopRequireDefault(_index);var _path=require('path');var _path2=_interopRequireDefault(_path);var _child_process=require('child_process');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}var css=new _index2.default();function runWatcher(input,output){(0,_child_process.spawn)('node',['./watcher.js',input,output],{detached:true,cwd:__dirname});}function startTransform(input,output){css.parse({input:input,output:output,useInheritance:true});if(process.env.BABEL_ENV==='development'){runWatcher(input,output);}return true;}