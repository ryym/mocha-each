# :construction: WIP :construction:

# itEach - Parameterized test for Mocha

This module provides a way to write simple parameterized tests in [Mocha].

[Mocha]: https://mochajs.org/

## Installation

```
npm install --save-dev mocha-it-each
```

## Usage

### Basic

`itEach` defines the same number of `it` blocks as the parameters length.
This means all the parameters are tested even if one or more tests fail during the test.

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
      const value = add(left, right);
      assert.equal(isNaN(value));
    });
  });
});
```

TODO: Image of result output

### Asynchronous code

When testing asynchronous code, please add a callback (usually named `done`) to
the arguments of the test function. The callback is same as the one which `it` gives.
See [Mocha - asynchronous code] for the detail.

[Mocha - asynchronous code]: https://mochajs.org/#asynchronous-code

```javascript
itEach('do async operation', [
  [0, 1],
  [2, 3]
], (arg, expected, done) => {
  callAsync(arg).then(actual => {
    assert.equal(actual, expected);
    done();
  });
});
```

### Exclusive or inclusive tests

You can call [.only()] and [.skip()] in the same way as `it`.

```javascript
// Run only these parameterized tests.
itEach.only('works fine', [
  0, 1, 2, 3
], number => {
  assert(number);
});

// Ignore these parameterized tests.
itEach.skip('also works fine', [
  'foo', 'bar', 'baz'
], word => {
  assert(word);
});
```

Note: When you use the `.only()`, `itEach` creates a nameless test suite by [describe()]
to define exclusive parameterized tests because we can't call `.only()` multiple times
(see [Mocha docs][.only()]).

[.only()]: http://mochajs.org/#exclusive-tests
[.skip()]: http://mochajs.org/#inclusive-tests
[describe()]: https://mochajs.org/#interfaces

## API

### itEach([testName, ] parameters, testBody)

#### testName: `String` or `Function`

You can define each test name as a string or function. If omitted,
the following default test name is applied.

```
  handles case ${index}
```

When `testName` is a function, it takes each parameter and index like:

```
  testName(p[0], p[1], .., p[n - 1], index);
```

#### parameters: `Array`

An array of parameters. Each parameter will be applied to `testBody` as arguments.

#### testBody: `Function`

A test function which will be called for each parameter.
So the function will be called like following:

```javascript
testBody.apply(mochaInstance, parameter);
```

## License

MIT
