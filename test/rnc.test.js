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
        { paddingTop: 30,
          paddingBottom: 30,
          paddingRight: 30,
          paddingLeft: 30,
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
      { paddingTop: 30,
        paddingBottom: 30,
        paddingRight: 30,
        paddingLeft: 30,
        marginTop: 65,
        alignItems: 'center' } })
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
    expect(data).toEqual({"row":{"top":50,"paddingTop":10,"paddingBottom":10,"paddingRight":10,"paddingLeft":5,"flexDirection":"row","marginTop":10,"marginLeft":10,"marginRight":10,"marginBottom":2,"borderBottomWidth":5,"opacity":0.6}});
    t.end();
  });
});
