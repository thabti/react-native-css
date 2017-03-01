import React, {Component} from 'react';
import {View,Text} from 'react-native';

import renderer from 'react-test-renderer';

import RNC from '../src/index';
import {register} from '../src/css';
import wrap from '../src/wrap';
const css = new RNC();

global.Promise = require.requireActual('promise');


describe('wrap', ()=> {
  it('should pass all properties to wrapped component and add styles to the view', async ()=> {
    //create the style object
    let styles = css.parse({
      input: './__tests__/fixtures/style-inherit.css',
      useInheritance: true
    });

    //register the global sheet
    register(styles);

    //define the wrapped component
    const TestComponent = wrap('TestComponent', class extends Component {
      render() {
        return <View {...this.props}/>;
      }
    });

    //render it
    const tree = renderer.create(
      <TestComponent className="direct" prop1="1" prop2="3" prop4="4"/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

});




