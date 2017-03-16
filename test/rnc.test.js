import t from 'babel-tap';
import expect from 'expect';
import RNC from '../src/index';
const css = new RNC();


t.test("Parse CSS", function(t) {
  css.parse('./test/fixtures/style.css', './test/fixtures/style.js', false, false, function(data) {
    expect(data).toEqual({ main: { background: '#000' } })
    t.end();
  });
});

t.test("Parse SCSS", function(t) {
  css.parse('./test/fixtures/style.scss', './test/fixtures/stylescss.js', false, false, function(data) {
    expect(data).toEqual({ description:
      { flex: 102,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 2,
        marginBottom: 4,
        fontSize: 18,
        textAlign: 'center',
        color: '#656656' },
        container:
        { padding: 30,
          marginTop: 65,
          alignItems: 'center' } })
          t.end();
        });
      });

t.test("Parse SCSS", function(t) {
css.parse('./test/fixtures/style.scss', './test/fixtures/stylescss.js', false, false, function(data) {
  expect(data).toEqual({ description:
    { flex: 102,
      marginLeft: 3,
      marginRight: 3,
      marginTop: 2,
      marginBottom: 4,
      fontSize: 18,
      textAlign: 'center',
      color: '#656656' },
      container:
      { padding: 30,
        marginTop: 65,
        alignItems: 'center' } })
        t.end();
      });
    });

t.test("Parse nested SCSS", function(t) {
css.parse('./test/fixtures/style-nested.scss', './test/fixtures/style-nested.js', false, false, function(data) {
  expect(data).toEqual({ regulations:
    { 
      textAlign: 'center',
      foo: {
        alignItems: 'center',
        alignSelf: 'center',
        button: {
          justifyContent: 'center'
        }
      }
    }});
    t.end();
  });
});

t.test("Parse SCSS error", function(t) {
  css.parse('./test/fixtures/style-20.scss', './test/fixtures/stylescss-20.js', false, false, function(data) {
    expect(data).toEqual({ maincontainer:
      { flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF' },
        rootcontainer: { flex: 1, fontSize: 18 } })
        t.end();
      });
    });

    t.test("Parse SCSS error", function(t) {
      css.parse('./test/fixtures/style-dorthwein.scss', './test/fixtures/stylescss-dorthwein.js', false, false, function(data) {
        expect(data).toEqual({ center: { alignItems: 'center', alignSelf: 'center', justifyContent: 'center', textAlign: 'center' }, text: { color: '#000' } });
        t.end();

        });
      });

t.test("Parse CSS and ignore unsupported property", function(t) {
  css.parse('./test/fixtures/style-unsupported.scss', './test/fixtures/style-unsupported.js', false, false, function(data) {
    expect(data).toEqual({ container: { background: 'white' } })
    t.end();
  });
});

t.test("Parse CSS and turn properties into numbers", function(t) {
  css.parse('./test/fixtures/style-number.scss', './test/fixtures/style-number.js', false, false, function(data) {
    expect(data).toEqual({ text:
      { fontSize: 12,
        width: 100 } })
    t.end();
  });
});

t.test("Regression test for issue #26", function(t) {
  css.parse('./test/fixtures/style-test.css', './test/fixtures/style-test.js', false, false, function(data) {
    expect(data).toEqual({"row":{"top":50,"paddingTop":10,"paddingBottom":10,"paddingRight":10,"paddingLeft":5,"flexDirection":"row","margin":10,"marginBottom":2,"borderBottomWidth":5,"opacity":0.6}});
    t.end();
  });
});

t.test("Argument --literal generates a javascript literal object", function(t) {
  css.parse('./test/fixtures/style-20.scss', './test/fixtures/style-test-literal.js', false, true, function(data) {
    var styles = require('./fixtures/style-test-literal.js');
    expect(styles.maincontainer.backgroundColor).toEqual("#F5FCFF");
    t.end();
  });
});

t.test("Parse CSS and expand shorthand properties", function(t){
  css.parse('./test/fixtures/style-expand.css','./test/fixtures/style-expand.js', false, false,function(data) {
    expect(data).toEqual({"container":{"paddingTop":10,"paddingBottom":10,"paddingLeft":20,"paddingRight":20,"marginLeft":15,"marginRight":15,"marginTop":10,"marginBottom":30,"borderTopWidth":10,"borderBottomWidth":10,"borderLeftWidth":30,"borderRightWidth":30,"borderTopLeftRadius":10,"borderBottomRightRadius":10,"borderBottomLeftRadius":30,"borderTopRightRadius":30},"second":{"margin":10,"paddingTop":1,"paddingRight":2,"paddingBottom":3,"paddingLeft":4,"borderTopWidth":1,"borderRightWidth":2,"borderBottomWidth":3,"borderLeftWidth":4,"borderTopLeftRadius":1,"borderTopRightRadius":2,"borderBottomRightRadius":3,"borderBottomLeftRadius":4},"borderSimple":{"borderWidth":1,"borderStyle":"solid","borderColor":"#eee"},"borderNoStyle":{"borderWidth":1,"borderColor":"#eee"},"borderNoUnit":{"borderWidth":1,"borderStyle":"solid","borderColor":"#eee"},"borderNamedColor":{"borderWidth":1,"borderStyle":"solid","borderColor":"blue"},"borderRGBColor":{"borderWidth":1,"borderStyle":"solid","borderColor":"rgb(100, 32, 250)"},"borderRGBAColor":{"borderWidth":1,"borderStyle":"solid","borderColor":"rgba(100, 32, 250, .5)"}})
    t.end()
  });
});

t.test("Parse CSS and transform properties", function(t) {
  css.parse('./test/fixtures/style-non-matching.scss', './test/fixtures/style-non-matching.js', false, false, function(data) {
    expect(data).toEqual({ container: {
        flex: 'unset',
        textDecorationLine: 'none',
    	textVerticalAlign: 'bottom'
    } })
    t.end();
  });
});
