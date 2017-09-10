import { test as it } from 'babel-tap';
import expect from 'expect';
import reactNativeCSS from '../src/index';

it('Parse CSS', (t) => {
  const data = reactNativeCSS`
    main {
      background: #000;
    }
  `;
  expect(data).toEqual({ main: { background: '#000' } });

  t.end();
});

it('Parse complex css', (t) => {
  const data = reactNativeCSS`

      description {
        flex: 102;
        margin: 2, 3, 4;
        font-size: 18;
        text-align: center;
        color: #656656;
      }

      container {
        padding: 30;
        margin-top: 65;
        align-items: center;
      }
  `;

  expect(data).toEqual({
    description: {
      flex: 102,
      marginLeft: 3,
      marginRight: 3,
      marginTop: 2,
      marginBottom: 4,
      fontSize: 18,
      textAlign: 'center',
      color: '#656656',
    },
    container: {
      padding: 30,
      marginTop: 65,
      alignItems: 'center',
    },
  });
  t.end();
});

it('Parse CSS and ignore unsupported property', (t) => {
  const data = reactNativeCSS`
  container {
    display: block;
    background: white;
  }
  `;

  expect(data).toEqual({ container: { background: 'white' } });

  t.end();
});

it('Parse CSS and turn properties into numbers', (t) => {
  const data = reactNativeCSS(`
  text {
  font-size: 12px;
  width: 100px;
}

  `);
  expect(data).toEqual({
    text: {
      fontSize: 12,
      width: 100,
    },
  });
  t.end();
});

it('Regression test for issue #26', (t) => {
  const data = reactNativeCSS`
    row {
      top: 50px;
      padding: 10px 10px 10px 5px;
      flex-direction: row;
      margin: 10px;
      margin-bottom: 2px;
      border-bottom-width: 5px;
      opacity: 0.6;
    }
    `;

  expect(data).toEqual({
    row: {
      top: 50,
      paddingTop: 10,
      paddingBottom: 10,
      paddingRight: 10,
      paddingLeft: 5,
      flexDirection: 'row',
      margin: 10,
      marginBottom: 2,
      borderBottomWidth: 5,
      opacity: 0.6,
    },
  });

  t.end();
});

it('Argument --literal generates a javascript literal object', (t) => {
  const data = reactNativeCSS`
        maincontainer {
            flex: 1;
            justify-content: center;
            align-items: center;
            background-color: #F5FCFF;
        }
        rootcontainer {
            flex: 1;
            font-size: 18;
        }
    `;

  expect(data.maincontainer.backgroundColor).toEqual('#F5FCFF');
  t.end();
});

it('Parse CSS and expand shorthand properties', (t) => {
  const data = reactNativeCSS`
        container {
          padding: 10px 20px;
          margin: 10px 15px 30px;
          border-width: 10px 30px;
          border-radius: 10px 30px;
        }

        second {
          margin: 10px;
          padding: 1px 2px 3px 4px;
          border-width: 1px 2px 3px 4px;
          border-radius: 1px 2px 3px 4px;
        }

        borderSimple {
          border: 1px solid #eee;
        }

        borderNoStyle {
          border: 1px #eee;
        }

        borderNoUnit {
          border: 1 solid #eee;
        }

        borderNamedColor {
          border: 1px solid blue;
        }

        borderRGBColor {
          border: 1px solid rgb(100, 32, 250);
        }

        borderRGBAColor {
          border: 1px solid rgba(100, 32, 250, .5);
        }
    `;

  expect(data).toEqual({
    container: {
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 20,
      paddingRight: 20,
      marginLeft: 15,
      marginRight: 15,
      marginTop: 10,
      marginBottom: 30,
      borderTopWidth: 10,
      borderBottomWidth: 10,
      borderLeftWidth: 30,
      borderRightWidth: 30,
      borderTopLeftRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 30,
      borderTopRightRadius: 30,
    },
    second: {
      margin: 10,
      paddingTop: 1,
      paddingRight: 2,
      paddingBottom: 3,
      paddingLeft: 4,
      borderTopWidth: 1,
      borderRightWidth: 2,
      borderBottomWidth: 3,
      borderLeftWidth: 4,
      borderTopLeftRadius: 1,
      borderTopRightRadius: 2,
      borderBottomRightRadius: 3,
      borderBottomLeftRadius: 4,
    },
    borderSimple: { borderWidth: 1, borderStyle: 'solid', borderColor: '#eee' },
    borderNoStyle: { borderWidth: 1, borderColor: '#eee' },
    borderNoUnit: { borderWidth: 1, borderStyle: 'solid', borderColor: '#eee' },
    borderNamedColor: { borderWidth: 1, borderStyle: 'solid', borderColor: 'blue' },
    borderRGBColor: { borderWidth: 1, borderStyle: 'solid', borderColor: 'rgb(100, 32, 250)' },
    borderRGBAColor: {
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'rgba(100, 32, 250, .5)',
    },
  });
  t.end();
});

it('Parse CSS and transform properties', (t) => {
  const data = reactNativeCSS`
    container {
      flex-grow: unset;
      text-decoration: none;
      vertical-align: bottom;
    }
  `;

  expect(data).toEqual({
    container: {
      flex: 'unset',
      textDecorationLine: 'none',
      textVerticalAlign: 'bottom',
    },
  });
  t.end();
});
it('Parse CSS and template literals', (t) => {
  const bottom = 'bottom';
  const data = reactNativeCSS`
    container {
      flex-grow: unset;
      text-decoration: none;
      vertical-align: ${bottom};
    }
  `;

  expect(data).toEqual({
    container: {
      flex: 'unset',
      textDecorationLine: 'none',
      textVerticalAlign: 'bottom',
    },
  });
  t.end();
});
