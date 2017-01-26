import fs from "fs";
export default class Utils {

  static arrayContains(value, arr) {
    for (var i = 0; i < arr.length; i++) {
      if (value === arr[i]) {
        return true;
      }
    }
    return false;
  }

  static filterArray(targetArray, excludeArray) {
    return targetArray.filter(value=>excludeArray.indexOf(value) === -1);
  }

  static clean(string) {
    return string.replace(/\r?\n|\r/g, "");
  }

  static readFile(file) {
    return fs.readFileSync(file, "utf8");
  }

  static outputReactFriendlyStyle(style, outputFile, prettyPrint, literalObject) {
    var indentation = prettyPrint ? 4 : 0;
    var jsonOutput = JSON.stringify(style, null, indentation);
    var output = "module.exports = ";
    output += (literalObject) ? `${jsonOutput}` : `require('react-native').StyleSheet.create(${jsonOutput});`;
    // Write to file
    if (outputFile) {
      fs.writeFileSync(outputFile, output);
    }
    return output;
  }

  static contains(string, needle) {
    var search = string.match(needle);
    return search && search.length > 0;
  }
}
