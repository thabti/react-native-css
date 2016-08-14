import toCamelCase from "to-camel-case";
//Text properties are typically inherited in normal CSS, and it is a pain in React Native to have to re-define a lot of
// properties.  Additionally it would be nice to use relative units, such as em and rem for sizing text as that is
// typical in modern web applications.
const textProps = ["fontSize", "color", "lineHeight", "fontFamily", "fontStyle",
  "fontWeight", "textAlign", "textDecorationLine", "textShadowColor", "textShadowOffset",
  "textShadowRadius", "textAlignVertical", "letterSpacing", "textDecorationColor", "textDecorationStyle", "writingDirection"];

const numeric      = ["font-size", "line-height", "letter-spacing", "text-shadow-radius"],
  numericProps = numeric.map(toCamelCase);

const defaultRootState = {fontSize: 14};

/**
 * This will expand styles into a tree that can be traversed for inheritance.
 * @param styles
 */
function expandStyles(styles) {
  let tree = {};
  for (let selector of Object.keys(styles)) {
    selector.split(",").forEach(select=> {
      let target = tree;
      select = select.replace(/\s*>\s*/g, ">").replace(/\s+/g, " ");
      select.split(" ").forEach(part=> {
        part.split(">").forEach((key, i)=> {
          target = (target[key] || (target[key] = {}));
          target._isDirectDescendent = i > 0;
        });
      });
      Object.assign(target, styles[selector]);
    });
  }
  return tree;
}

function getInheritedProperties(state, node, rootState) {
  state = Object.assign({}, state);
  textProps.forEach(prop=> {
    if (node && node[prop]) {
      let value = node[prop];
      if (numericProps.indexOf(prop) > -1 && typeof value === "string") {
        let numericValue     = parseFloat(value.replace(/[^0-9\.]/g, "")),
          isRelativeToRoot = value.indexOf("rem") > -1,
          isRelative       = value.indexOf("em") > -1;
        if (isRelativeToRoot) {
          numericValue *= rootState[prop];
        } else if (isRelative) {
          numericValue *= (state[prop] || 0);
        }

        node[prop] = ~~numericValue;
      }
      state[prop] = node[prop];
    }
  });
  return state;
}

function cleanInherits(inherited, node) {
  let keys  = Object.keys(node),
    clean = {};
  Object.keys(inherited).forEach(key=> {
    if (keys.indexOf(key) === -1) {
      clean[key] = inherited[key];
    }
  });
  return clean;
}

function inherit(node, state, rootState) {
  if (!state) {
    rootState = Object.assign({}, defaultRootState, node.root);
    rootState = state = getInheritedProperties(rootState, node.root, rootState);
  }
  let cleanNode = {};
  for (let key of Object.keys(node)) {
    let childNode = node[key];
    let textPsuedo = key.toLowerCase().indexOf(":text") > -1;
    key = key.replace(/:text/i, "");
    if ((key.toLowerCase().indexOf("text") === 0 || textPsuedo) && typeof childNode === "object") {
      cleanNode[key + "&inherited"] = cleanInherits(getInheritedProperties(state, childNode, rootState), childNode);
      cleanNode[key] = childNode;
    } else if (childNode && typeof childNode === "object") {
      cleanNode[key] = inherit(childNode, getInheritedProperties(state, childNode, rootState), rootState);
    } else if (textProps.indexOf(key) === -1) {
      cleanNode[key] = childNode;
    }
  }
  return cleanNode;
}

function flatten(tree, flatObject = {}, name = "") {
  let flatStyle = {};
  for (let key of Object.keys(tree)) {
    let value              = tree[key],
      isDirectDescendent = value._isDirectDescendent;
    if (typeof value === "object") {
      flatten(value, flatObject, name + (isDirectDescendent ? ">" : " ") + key);
    } else if (key !== "_isDirectDescendent") {
      flatStyle[key] = value;
    }
  }
  if (Object.keys(flatStyle).length > 0) {
    flatObject[name.trim()] = flatStyle;
  }
  return flatObject;
}

export default function inheritance(styles) {
  return flatten(inherit(expandStyles(styles)));
}
export {numeric};
