import assert from 'power-assert';
import forEach from '../lib';

/* Sample code using 'itEach' */
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
        assert(isNaN(value));
      });
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
      ['dog', 'bowow'],
      ['cat', 'meow'],
      ['cow', 'mow'],
      ['nothing', '...']
    ])
    .it(
      (animal, cry) => `A ${animal} should cry '${cry}'`,
      (animal, cry) => {
        assert.equal(cry, letCry(animal));
      }
    );
  });

  function asBool(value) {
    return Boolean(value);
  }

  /* Omit test case name */
  describe('asBool()', () => {
    forEach([
      'string',
      100,
      true,
      {}
    ])
    .it(value => `handles ${JSON.stringify(value)}`, value => {
      assert.equal(asBool(value), true);
    });
  });

  function delayGreet(name, callback) {
    setTimeout(() => {
      callback(`Hi, ${name}!`);
    }, 30);
  }

  /* With asynchronous code */
  describe('delayGreet()', () => {
    forEach([
      'Alis', 'Bob', 'Caroline'
    ])
    .it('greets will be delayed', (name, done) => {
      delayGreet(name, greet => {
        assert.equal(greet, `Hi, ${name}!`);
        done();
      });
    });
  });
});

