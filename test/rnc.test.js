import t from 'babel-tap';
import expect from 'expect';
import RNC from '../src/index';
const css = new RNC();


t.test("Parse CSS", function(t) {
  css.parse('./test/fixtures/style.css', './test/fixtures/style.js', false, function(data) {
    expect(data).toEqual({ main: { background: '#000' } })
    t.end();
  });
});

t.test("Parse SCSS", function(t) {
  css.parse('./test/fixtures/style.scss', './test/fixtures/stylescss.js', false, function(data) {
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
css.parse('./test/fixtures/style.scss', './test/fixtures/stylescss.js', false, function(data) {
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
  css.parse('./test/fixtures/style-20.scss', './test/fixtures/stylescss-20.js', false, function(data) {
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
      css.parse('./test/fixtures/style-dorthwein.scss', './test/fixtures/stylescss-dorthwein.js', false, function(data) {
        expect(data).toEqual({ center: { alignItems: 'center', alignSelf: 'center', justifyContent: 'center', textAlign: 'center' }, text: { color: '#000' } });
        t.end();

        });
      });
