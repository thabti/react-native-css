import fs from 'fs';

export default class Utils {

  static arrayContains(value, arr) {
    var flag = false;
    for (var i = 0; i < arr.length; i++) {
      if (value === arr[i]) {
        return true
      }
    }
    return flag;
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
    wstream.write(`module.exports = require('react-native').StyleSheet.create(${JSON.stringify(style, null, indentation)});`);
    wstream.end();
    return style;
  }

  static contains(string, needle) {
    var search = string.match(needle);
    return search && search.length > 0;
  }
}
