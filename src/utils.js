export default class Utils {
  static arrayContains(value, arr) {
    for (let i = 0; i < arr.length; i++) {
      if (value === arr[i]) {
        return true;
      }
    }
    return false;
  }

  static clean(string) {
    return string.replace(/\r?\n|\r/g, '');
  }

  static contains(string, needle) {
    const search = string.match(needle);
    return search && search.length > 0;
  }
}

export const handleTags = (strings, ...values) => {
  let result = '';

  for (let i = 0; i < strings.length; i++) {
    result += strings[i];
    if (i < values.length) {
      result += values[i];
    }
  }

  return result;
};
