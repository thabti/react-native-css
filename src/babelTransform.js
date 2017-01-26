import RNC from './index';
import fs from 'fs';
import path from 'path';
import {spawn} from 'child_process';
const css = new RNC();

function runWatcher(input, output) {
  spawn('node', ['./watcher.js', input, output], {detached: true, cwd: __dirname});
}

function startTransform(input, output) {
  try {
    fs.mkdirSync('./_css');
  } catch (e) {
  }

  css.parse({
    input,
    output,
    useInheritance: true
  });

  if (process.env.BABEL_ENV === 'development') {
    runWatcher(input, output);
  }
  return true;
}

//

export default function ({ types: t }) {
  return {
    visitor: {
      ImportDeclaration (transformPath, {file}) {
        let resolvePath = transformPath.node.source.value;
        if (resolvePath.startsWith('css!')) {
          resolvePath = resolvePath.substr(4);
          let name = resolvePath.replace(/\.\.\/|\.\//g, '').replace(/\//g, '_').split('.')[0];
          let absolutePath = path.resolve(resolvePath),
            relativePath = `${path.dirname(path.relative('./', file.opts.filename))}/_css/${name}.js`;
          startTransform(absolutePath, path.resolve(`./_css/${name}.js`));

          let expression = (t.callExpression(t.memberExpression(t.callExpression(t.identifier('require'), [t.stringLiteral('react-native-css')]), t.identifier('register')), [t.callExpression(t.identifier('require'), [t.stringLiteral(relativePath)])]));
          transformPath.replaceWith(expression);
        }
      }
    }
  };
}
