import {StyleSheet} from 'react-native'
//The flattened reference object of all the styles. Note that since all styles are passed via StyleSheet.create
// references, duplicate selectors replace previous ones instead of merging.  This is a major difference from standard
// CSS behavior.
let styles     = {},
    //This is an object containing all the rules in the styles sheets for matching against
    ruleKeys   = {},
    //This is all the sheets, which is maintained for allowing unregister to work.
    sheets     = [],
    //Cache for matching styles against a given path.
    styleCache = {};
/**
 // Format of ruleKeys
 ruleKeys = {
  //last element in selector, e.g. 'view .someClass text' would be added to the 'text' array of rules.  If the last
  // element is a class, e.g. 'view .someClass', the element is '*' meaning it matches all elements as that is implicit
  // in the selector 'view *.someClass'.  This is intended for faster look-ups.
  '[element|*]': [
    {
      c: ['someClass'],
      //Order in the stylesheet orders of matching specificity are treated in a last wins matter
      o: 0,
      //The specificity calculation, the more specific the selector, the higher the priority. After matching rules are
      // found, they are sorted according to 's' and then 'o'
      s: 10,
      //this is if the selector has ancestor(s). if immediate, this will fail if the immediate parent does have this
      a: [{e: 'view', i: true,ps:['last-child'], c: ['someClass']}]
    }
  ]
}
 */

/**
 * Pseudo class selectors
 * @type {*[]}
 */
const pseudos = [
  {
    regex: /^first-child$/i,
    match: (matches, element)=>element.f
  },
  {
    regex: /^last-child$/i,
    match: (matches, element)=>element.l
  },
  {
    regex: /^nth-child\(([0-9]+)\)$/i,
    match: (matches, element)=>element.i == matches[1]
  },
  {
    regex: /^not\(([a-z0-9\-\._]+)\)$/i,
    match: (matches, element)=> {
      return matches[1].split('.').filter(a=>a).every(className=>element.c.indexOf(className) === -1)
    }
  }
]
/**
 * Takes the flattened style sheet and creates the rules based on the selector declarations.  This is automatically
 * called by flattenSheets.
 * @param {styles} styles
 * @return {ruleKeys}
 */
function createRules(styles) {
  let rules = {}
  //root view>text.hello text
  Object.keys(styles).forEach((key, o)=> {
    let path = []
    key.replace(/\s*>\s*/g, '>').replace(/\s+/g, ' ').split(' ').forEach(part=> {
      let immediates = part.split('>')
      immediates.forEach((immediate, i)=> {
        let pseudo  = immediate.split(':'),
            normal  = pseudo.shift(),
            classes = normal.split('.').filter(a=>a),
            element = normal.charAt(0) === '.' ? '*' : classes.shift()
        //prep pseudo functions
        pseudo = pseudo.map(pseudo=>pseudos.find(test=> test.regex.exec(pseudo))).map(test=> {
          let matches = test.regex.exec(pseudo)
          if (matches) {
            return test.match.bind(null, matches)
          }
        }).filter(ps=>ps)

        path.push({
          e: element,
          c: classes,
          ps: pseudo.length && pseudo,
          i: immediates.length > 0 && i != immediates.length - 1
        })
      })
    })
    path = path.reverse()
    let first = path.shift()
    //Calculate specificity
    let specificity = 0
    //add +10 for classes
    specificity += first.c.length * 10;
    if (path.length > 0 && path.i) {
      specificity += 5
    }
    if (first.e !== '*') {
      specificity++;
    }

    path.forEach(a=> {
      specificity += a.c.length
    });

    if (!rules[first.e]) {
      rules[first.e] = []
    }
    rules[first.e].push(Object.assign({}, first, {a: path, s: specificity, o, k: key}))
  })
  return rules
}

/**
 * Test to see if the target matches the matching element.  Compares element type and classes.  The target must have
 * all the classes in matching, but can have more.
 * @param target
 * @param matching
 * @return {boolean}
 */
function elementMatches(target, matching) {
  if (target.e !== matching.e && matching.e !== '*') {
    return false
  }
  if (matching.c && !matching.c.every(className=>target.c && target.c.indexOf(className) > -1)) {
    return false
  }
  return !matching.ps || matching.ps.every(match=> match(target))
}

/**
 * Finds all the rules that match the passed path, sorted by specificity asc.
 * @param {[{e:String,c:[String],p:{},i:Number,f:Boolean,l:Boolean}]} path
 * @return {[String]} Array of references to StyleSheets
 */
function matchingRules(path, key) {
  try {
    if (!key) {
      key = JSON.stringify(path)
    }
    if (styleCache[key]) {
      return styleCache[key]
    }

    path = path.slice(0).reverse()
    if (!path[0]) {
      return styleCache[key] = null
    }
    let element = path[0].e,
        classes = path[0].c


    //find matching
    let starting = (ruleKeys[element] || []).concat(ruleKeys['*'] || [])
    let matchingStyles = starting.filter(rule=> {
      if (!elementMatches(path[0], rule)) {
        return
      }
      let index = 1, lastRelative = -1
      return rule.a.every((ancestor, i)=> {
        main:for (; index < path.length; index++) {
          if (elementMatches(path[index], ancestor)) {
            if (!ancestor.i) {
              lastRelative = i
            }
            index++
            return true
          } else if (ancestor.i) {
            if (lastRelative > -1) {
              //push the path up to the next matching
              index++
              let ancestors      = rule.a.slice(lastRelative, i - 1),
                  directAncestor = ancestor.shift()
              for (; index < path.length; index++) {
                if (elementMatches(path[index], directAncestor)) {
                  directAncestor = ancestors.shift()
                  if (!directAncestor) {
                    continue main;
                  }
                }
              }
            }
            return false
          }
        }
      })
    })
    //sort styles by specificity and then by order in style sheet so that the highest specificity is the last rule,
    // overwriting any previous rules
    matchingStyles.sort((rule1, rule2)=>(rule1.s - rule2.s) || (rule1.o - rule2.o))
    styleCache[key] = StyleSheet.flatten(matchingStyles.map(rule=>styles[rule.k + '&inherited']).concat(matchingStyles.map(rule=>styles[rule.k])).filter(rule=>rule))
    return styleCache[key]
  } catch (e) {
    console.warn(e, path)
    return []
  }
}

/**
 * Converts the passed arguments to a style array which can be set into the style prop in a React component
 * @param {[[]|String,{]} args
 * @return {*}
 */
function css(...args) {
  let first = args[0];
  return args.map(arg=> {
    if (arg instanceof Array) {
      return matchingRules(arg)
    } else if (typeof arg === 'string') {
      if (arg.charAt(0) === '&') {
        first = arg = first + '.' + arg.substr(1);
      }
      return [];
//      matchingRules(arg);
    } else {
      return arg;
    }
  })
}

/**
 * Flattens all the registerd sheets into the style object and updates ruleKeys with the declarations
 */
function flattenSheets() {
  styles = Object.assign.apply(null, [{}].concat(sheets));
  ruleKeys = createRules(styles)
}

/**
 * Registers the passed style sheets to be used against the CSS method and wrapped StyledComponents
 * @param {...StyleSheet} stylesheets
 */
function register(...stylesheets) {
  sheets.push(...stylesheets);
  flattenSheets();
}

/**
 * Removes the stylesheets from the style component.  This is useful for changing themes while using the application or
 * activating style settings for things like accessibility.
 * @param stylesheets
 */
function unregister(...stylesheets) {
  stylesheets.forEach(sheet=> {
    let index = sheets.indexOf(sheet);
    if (index > -1) {
      sheets.splice(index, 1);
    }
  });
  flattenSheets();
}

export default css
export {register,unregister,matchingRules}
