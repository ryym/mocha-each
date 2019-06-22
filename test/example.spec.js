import assert from 'power-assert';
import forEach from '../lib';

/* Sample code using 'mocha-each' */
describe('Example', () => {
  function add(a, b) {
    return parseInt(a) + parseInt(b);
  }

  /* Basic use */
  describe('add()', () => {
    forEach([
      [1, 1, 2],
      [2, -2, 0],
      [140, 48, 188]
    ])
    .it('adds %d and %d then returns %d', (left, right, expected) => {
      assert.equal(add(left, right), expected);
    });

    context('with invalid arguments', () => {
      forEach([
        [1, 'foo'],
        [null, 10],
        [{}, []]
      ])
      .it('adds %j and %j then returns NaN', (left, right) => {
        const value = add(left, right);
        assert(isNaN(value));
      });
    });
  });

  function subtract(a, b) {
    return parseInt(a) - parseInt(b);
  }

  /* Basic use at describe level */
  forEach([
    [1, 1, 0],
    [2, -2, 4],
    [140, 48, 92]
  ])
  .describe('subtract() with %d and %d', (left, right, expected) => {
    let actual;

    before(() => {
      actual = subtract(left, right);
    });

    it('subtracts correctly and returns ' + expected, () => {
      assert.equal(actual, expected);
    });
  });

  function letCry(animal) {
    switch(animal) {
    case 'dog': return 'bowow';
    case 'cat': return 'meow';
    case 'cow': return 'mow';
    default: return '...';
    }
  }

  /* Generate test case name dynamically */
  describe('letCry()', () => {
    forEach([
      ['dog', { cry: 'bowow' }],
      ['cat', { cry: 'meow' }],
      ['cow', { cry: 'mow' }],
      ['nothing', { cry: '...' }]
    ])
    .it(
      (animal, data) => `A ${animal} should cry '${data.cry}'`,
      (animal, data) => {
        assert.equal(data.cry, letCry(animal));
      }
    );
  });

  function asBool(value) {
    return Boolean(value);
  }

  /* Use single value parameters */
  describe('asBool()', () => {
    forEach([
      'string',
      100,
      true,
      {}
    ])
    .it('handles %j', value => {
      assert(asBool(value));
    });
  });

  function delayGreet(name, ms, callback) {
    setTimeout(() => {
      callback(`Hi, ${name}!`);
    }, ms);
  }

  /* With asynchronous code */
  describe('delayGreet()', function() {
    forEach([
      ['Alis', 30],
      ['Bob', 40],
      ['Caroline', 50]
    ])
    .it('greets to %s after %d ms', function(name, ms, done) {
      this.timeout(80); // Configure timeout.
      delayGreet(name, ms, greet => {
        assert.equal(greet, `Hi, ${name}!`);
        done();
      });
    });
  });
});

