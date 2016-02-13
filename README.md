# :construction: WIP :construction:

# Mocha Each - Parameterized Test for Mocha

This module provides a way to write simple parameterized tests in [Mocha].

[Mocha]: https://mochajs.org/

## Installation

```
npm install --save-dev mocha-each
```

## Usage

### Basic

The function mocha-each provides takes parameters as an array. And then you can define
test cases for each parameter. All the test cases you defined are executed even if
one or more cases fail during the test.

```javascript
const assert = require('assert');
const forEach = require('mocha-each');

function add(a, b) {
  return parseInt(a) + parseInt(b);
}

describe('add function', () => {
  forEach([
    [[1, 1], 2],
    [[2, -2], 0],
    [[140, 48], 188]
  ])
  .it('adds two numbers', (left, right, expected) => {
    assert.equal(add(left, right), expected);
  });

  context('with invalid arguments', () => {
    forEach([
      [1, 'foo'],
      [null, 10],
      [undefined, undefined],
      [{}, []]
    ])
    .it('returns NaN value', (left, right) => {
      const value = add(left, right);
      assert.equal(isNaN(value));
    });
  });
});
```

TODO: Image of result output

### Asynchronous code

When testing asynchronous code, you need to add a callback as a last argument of
the test function and call it. The callback is same as the one which Mocha's `it` gives.
See [Mocha - asynchronous code] for the detail.

[Mocha - asynchronous code]: https://mochajs.org/#asynchronous-code

```javascript
forEach([
  [0, 1],
  [2, 3]
])
.it('do async operation', (arg, expected, done) => {
  fetchData(arg)
    .then(actual => assert.equal(actual, expected))
    .then(done);
});
```

### Exclusive or inclusive tests

You can call [.only()] and [.skip()] in the same way as Mocha's `it`.

```javascript
// Run only these parameterized tests.
forEach([
  0, 1, 2, 3
])
.it.only('works fine', number => {
  assert(number);
});

// Ignore these parameterized tests.
forEach([
  'foo', 'bar', 'baz'
])
.it.skip('also works fine', word => {
  assert(word);
});
```

Note:
When you use the `.only()`, mocha-each creates a nameless test suite by [describe()]
to define exclusive parameterized tests because we can't call `.only()` multiple times
(see [Mocha docs][.only()]).

[.only()]: http://mochajs.org/#exclusive-tests
[.skip()]: http://mochajs.org/#inclusive-tests
[describe()]: https://mochajs.org/#interfaces

## API

### forEach(parameters).it(title, testCase)

#### parameters: `Array`

An array of parameters. Each parameter will be applied to `testCase` as its arguments.

#### title: `String` or `Function`

A title of the test case. You can define each title as a string or function.
When it is a function, it takes each parameter and index as its arguments like:

```
  title(p[0], p[1], .., p[n - 1], index);
```

#### testCase: `Function`

A test function which will be called for each parameter.
So the function will be called like following:

```javascript
testCase.apply(mochaInstance, parameter);
```

## Tips

You can define the name of mocha-each function as you like when requiring it.
Here's a example which uses more BDD-like name.

```javascript
const withThese = require('mocha-each');

describe('findByName()', () => {
  withThese([
    [1, 'foo'],
    [2, 'bar'],
    [3, 'baz']
  ])
  .it('should find data by name', (id, name) => {
    const data = findByName(name);
    assert.equal(data.id, id);
  });
});
```

## License

MIT
