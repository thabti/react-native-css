import RNC from '../src/index';
import matchRules,{register} from '../src/css';
const css = new RNC();

global.Promise = require.requireActual('promise');

describe('React Native CSS Command-line', ()=> {

  it("should parse CSS", async ()=> {
    let data = await css.parse({input: './__tests__/fixtures/style.css'});
    expect(data).toEqual({main: {backgroundColor: '#000'}});
  });

  it("shoud parse SCSS", async ()=> {
    let data = await css.parse({input: './__tests__/fixtures/style.scss'});
    expect(data).toEqual({
      description: {
        flex: 102,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 2,
        marginBottom: 4,
        fontSize: 18,
        textAlign: 'center',
        color: '#656656'
      },
      container: {
        padding: 30,
        marginTop: 65,
        alignItems: 'center'
      }
    });
  });

  it("Parse SCSS error", async ()=> {
    let data = await css.parse({input: './__tests__/fixtures/style-20.scss'});
    expect(data).toEqual({
      maincontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
      },
      rootcontainer: {flex: 1, fontSize: 18}
    });
  });

  it("Parse SCSS error", async ()=> {
    let data = await css.parse({input: './__tests__/fixtures/style-dorthwein.scss'});
    expect(data).toEqual({
      center: {
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }, text: {color: '#000'}
    });
  });

  it("Parse CSS and ignore unsupported property", async ()=> {
    let data = await css.parse({input: './__tests__/fixtures/style-unsupported.scss'});
    expect(data).toEqual({container: {background: 'white'}});
  });

  it("Parse CSS and turn properties into numbers", async ()=> {
    let data = await css.parse({input: './__tests__/fixtures/style-number.scss'});
    expect(data).toEqual({
      text: {
        fontSize: 12,
        width: 100
      }
    });
  });

  it("Regression test for issue #26", async ()=> {
    let data = await css.parse({input: './__tests__/fixtures/style-test.css'});
    expect(data).toEqual({
      "row": {
        "top": 50,
        "paddingTop": 10,
        "paddingBottom": 10,
        "paddingRight": 10,
        "paddingLeft": 5,
        "flexDirection": "row",
        "margin": 10,
        "marginBottom": 2,
        "borderBottomWidth": 5,
        "opacity": 0.6
      }
    });
  });

  it("Argument --literal generates a javascript literal object", async ()=> {
    await css.parse({
      input: './__tests__/fixtures/style-20.scss',
      output: './__tests__/fixtures/style-test-literal.js', //actually tests the output
      objectLiteral: true
    });
    var styles = require('./fixtures/style-test-literal.js');
    expect(styles.maincontainer.backgroundColor).toEqual("#F5FCFF");

  });

  it("Parse CSS and expand shorthand properties", async ()=> {
    let data = await css.parse({input: './__tests__/fixtures/style-expand.css'});
    expect(data).toEqual({
      "container": {
        "paddingTop": 10,
        "paddingBottom": 10,
        "paddingLeft": 20,
        "paddingRight": 20,
        "marginLeft": 15,
        "marginRight": 15,
        "marginTop": 10,
        "marginBottom": 30,
        "borderTopWidth": 10,
        "borderBottomWidth": 10,
        "borderLeftWidth": 30,
        "borderRightWidth": 30,
        "borderTopLeftRadius": 10,
        "borderBottomRightRadius": 10,
        "borderBottomLeftRadius": 30,
        "borderTopRightRadius": 30
      },
      "second": {
        "margin": 10,
        "paddingTop": 1,
        "paddingRight": 2,
        "paddingBottom": 3,
        "paddingLeft": 4,
        "borderTopWidth": 1,
        "borderRightWidth": 2,
        "borderBottomWidth": 3,
        "borderLeftWidth": 4,
        "borderTopLeftRadius": 1,
        "borderTopRightRadius": 2,
        "borderBottomRightRadius": 3,
        "borderBottomLeftRadius": 4
      },
      "borderSimple": {"borderWidth": 1, "borderStyle": "solid", "borderColor": "#eee"},
      "borderNoStyle": {"borderWidth": 1, "borderColor": "#eee"},
      "borderNoUnit": {"borderWidth": 1, "borderStyle": "solid", "borderColor": "#eee"},
      "borderNamedColor": {"borderWidth": 1, "borderStyle": "solid", "borderColor": "blue"},
      "borderRGBColor": {"borderWidth": 1, "borderStyle": "solid", "borderColor": "rgb(100, 32, 250)"},
      "borderRGBAColor": {"borderWidth": 1, "borderStyle": "solid", "borderColor": "rgba(100, 32, 250, .5)"}
    });
  });

  it("Test inheritance CSS", ()=> {
    let data = css.parse({input: './__tests__/fixtures/style-inherit.css', useInheritance: true});
    register(data);

    expect(matchRules([{e: 'view', c: ['test']}, {e: 'view', c: ['test']}, {
      e: 'text',
      c: ['hello']
    }])).toEqual([{fontSize: 14, margin: 5, color: 'black'}]);

    expect(matchRules([{e: 'view', c: ['test']}, {e: 'view', c: ['test']}, {
      e: 'scrollview',
      c: ['hello']
    }])).toEqual([{margin: 5, padding: 10}]);

    //Make sure that the text is inheriting from the sibling selector
    expect(matchRules([{e: 'view', c: ['test']}, {e: 'view', c: ['direct']}, {
      e: 'text',
      c: ['hello']
    }])).toEqual([{fontSize: 16, margin: 5, color: 'blue'}]);

    expect(matchRules([{e: 'view', c: ['test']}, {e: 'view', c: ['direct']}, {e: 'view', c: ['test']}, {
      e: 'text',
      c: ['hello']
    }])).toEqual([{fontSize: 14, margin: 5, color: 'black'}]);
  });
});
