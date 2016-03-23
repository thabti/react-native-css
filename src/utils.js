import fs from 'fs';

export default class Utils {

  static arrayContains(value, arr) {
    for (var i = 0; i < arr.length; i++) {
      if (value === arr[i]) {
        return true
      }
    }
    return false;
  }

  static clean(string) {
    return string.replace(/\r?\n|\r/g, "");
  }

  static readFile(file, cb) {
    fs.readFile(file, "utf8", cb);
  }

  static outputReactFriendlyStyle(style, outputFile, prettyPrint) {
    var indentation = prettyPrint ? 4 : 0;
    var wstream = fs.createWriteStream(outputFile);
    var output = JSON.stringify(style, null, indentation);
    wstream.write(`module.exports = require('react-native').StyleSheet.create(${output});`);
    wstream.end();
    return output;
  }

  static contains(string, needle) {
    var search = string.match(needle);
    return search && search.length > 0;
  }
}
