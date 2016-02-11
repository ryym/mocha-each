# :construction: WIP :construction:

# itEach - Parameterized test for Mocha

This module provides a way to write simple parameterized tests in [Mocha].

[Mocha]: https://mochajs.org/

## Usage

```javascript
const assert = require('assert');
const itEach = require('mocha-it-each');

function add(a, b) {
  return parseInt(a) + parseInt(b);
}

describe('add function', () => {
  itEach('adds two numbers', [
    [[1, 1], 2],
    [[2, -2], 0],
    [[140, 48], 188]
  ], (args, expected) => {
    assert.equal(add.apply(null, args), expected);
  });

  context('with invalid arguments', () => {
    itEach('returns NaN value', [
      [1, 'foo'],
      [null, 10],
      [undefined, undefined],
      [{}, []]
    ], (left, right) => {
      assert.equal(add(left, right), NaN);
    });
  });
});
```

TODO: Image of result output

`itEach` defines the same number of `it` blocks as the parameters length.
This means all the parameters are tested even if one or more tests fail during the test.

## Installation

```
npm install --save-dev mocha-it-each
```

## API

### itEach([testName, ] parameters, testBody)

#### testName: `String` or `Function`

You can define each test name as a string or function. If omitted,
the following default test name is applied.
When `testName` is a function, it takes each parameter as arguments.

```
  handles JSON.stringify(param)
```

#### parameters: `Array`

An array of parameters. Each parameter will be applied to `testBody` as arguments.

#### testBody: `Function`

A test function which will be called for each parameter.
So the function will be called like following:

```javascript
testBody.apply(mochaInstance, parameter);
```

### Test with asynchronous code

TODO

### Exclusive or inclusive tests

You can call [.only()] and [.skip()] in the same way as `it`.

[.only()]: http://mochajs.org/#exclusive-tests
[.skip()]: http://mochajs.org/#inclusive-tests

```javascript
itEach.only('works fine', ...);
itEach.skip('do something', ...);
```

## License

MIT
