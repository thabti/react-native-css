import React,{Component} from 'react';
import css,{matchingRules} from './css';
import shallowCompare from 'react/lib/shallowCompare'
import hoistNonReactStatics from 'hoist-non-react-statics'
function normalizeClassNames(classNames) {
  let classes = [];
  if (typeof classNames === 'string') {
    classes = classNames.split(' ').filter(a=>a);
  } else if (classNames instanceof Array) {
    classNames.forEach(name=> {
      classes.push(...normalizeClassNames(name))
    });
  }

  return classes;
}

/**
 * This takes an array of components and adds position properties for leveraging :first-child, :last-child,
 * :nth-child(1...n) selectors.  Without these properties, those selectors will fail.
 * Passing a single component will result in first,last and nth(1) all succeeding.
 * A key is automatically added (just the index) if omitted, which allows easily adding this to static children.
 * @param {[Component]|Component} componentOrComponentArray
 * @return {*}
 */
function map(componentOrComponentArray) {
  return (componentOrComponentArray instanceof Array ? componentOrComponentArray : [componentOrComponentArray]).map((component, i)=> {
    return React.cloneElement(component, {
      firstChild: i === 0,
      lastChild: i === componentOrComponentArray.length - 1,
      nthChild: i + 1,
      key: i
    });
  });
}

/**
 * Takes the passed component and wraps it in a styled proxy.  All props are passed through.
 * Path information is handled via Context, so be careful not to override the 'path' context value.
 * @param {string} name Name that will be used in CSS selectors, case insensitive.
 * @param {Component} WrappedComponent
 * @return {StyledComponent}
 */
export default function wrap(name, WrappedComponent) {
  let StyledComponent = class extends Component {

    componentWillReceiveProps(nextProps) {
      if (shallowCompare(this, nextProps)) {
        this.cssPathKey = null
      }
    }

    shouldComponentUpdate(nextProps) {
      return shallowCompare(this, nextProps);
    }

    //This is the magic right here.
    getChildContext() {
      let self = this
      return {
        get cssPath() {
          if (!self.cssPath) {
            self.createPath(self.props)
          }
          return self.cssPath
        },
        get cssPathKey() {
          if (!self.cssPath) {
            self.createPath(self.props)
          }
          return self.cssPathKey
        }
      };
    }

    get pathKey() {
      if (!this.cssPathKey || this.context.cssPathKey !== this._lastPathKey) {
        this.createPath(this.props)
        this._lastPathKey = this.context.cssPathKey
      }
      return this.cssPathKey
    }

    get styles() {
      if (!this.style || this._lastKey !== this.pathKey) {
        if (!this.cssPath) {
          this.createPath(this.props)
        }
        let style = matchingRules(this.cssPath, this.cssPathKey)
        this.style = this.props.style ? css(style, this.props.style) : style
        this._lastKey = this.pathKey
      }
      return this.style
    }

    setNativeProps(nativeProps) {
      this._root && this._root.setNativeProps(nativeProps);
    }

    /**
     * This updates the path and style with the latest props
     * @param props
     */
    createPath(props) {
      let element = {
        e: name.toLowerCase(),
        c: normalizeClassNames(props.className),
//        p: props,
        i: props.nthChild || -1,
        f: props.firstChild || false,
        l: props.lastChild || false
      }
      let key = `${this.context.cssPathKey || ''}>${element.e}.${element.c.join('.')}:${element.i || ''}:${element.f || ''}:${element.l || ''}`
      if (this.cssPathKey !== key) {
        console.log('creating key')
        this.cssPath = (this.context.cssPath || [{e: 'root'}]).concat([element]);
        this.cssPathKey = key
      }
    }

    render() {
      let props = {ref: ref=>this._root = ref, style: this.styles}
      return <WrappedComponent {...this.props} {...props}/>
    }
  }

  hoistNonReactStatics(StyledComponent, WrappedComponent)
  StyledComponent.WrappedComponent = WrappedComponent
  StyledComponent.displayName = name
  StyledComponent.childContextTypes = {
    cssPath: React.PropTypes.array,
    cssPathKey: React.PropTypes.string
  };
  //Make sure we are getting our parent's path
  StyledComponent.contextTypes = {cssPath: React.PropTypes.array, cssPathKey: React.PropTypes.string};
  return StyledComponent
}

export {map}
