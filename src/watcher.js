import 'babel-polyfill';
import RNC from './index';
import fs from 'fs';
import request from 'request';
import chokidar from 'chokidar';

const css = new RNC();

/**
 * Checks if the packager is running, if not there really isn't point of keeping this thing alive.
 * @return {Promise}
 */
function isServerRunning() {
  return new Promise(resolve=>request('http://localhost:8081/status', (err, response, body)=> {
    resolve(body === "packager-status:running");
  }));
}

async function run() {
  let input  = process.argv[2],
    output = process.argv[3];

  if (!input || !output) {
    return;
  }

  //check pid
  let name    = input.replace(/[^0-9a-z]/g, ''),
    pidFile = `/tmp/rnc_watch_${name}.pid`;

  function check() {
    try {
      return process.kill(~~fs.readFileSync(pidFile, 'utf8'), 0);
    }
    catch (e) {
      return e.code === 'EPERM';
    }
  }

  if (check()) {
    return process.exit(0);
  }

  fs.writeFileSync(pidFile, process.pid, 'utf8');

  //check if server is up
  if (!(await isServerRunning())) {
    return process.exit(0);
  }

  chokidar.watch(input, {
    ignored: /[\/\\]\./, persistent: true
  }).on('change', function () {
    css.parse({input, output, useInheritance: true});
  });

  setInterval(async ()=> {
    if (!(await isServerRunning())) {
      process.exit(0);
    }
  }, 10000);

}


run();
