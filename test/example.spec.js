import assert from 'power-assert';
import itEach from '../lib';

/* Sample code using 'itEach' */
describe('Example', () => {
  function add(a, b) {
    return parseInt(a) + parseInt(b);
  }

  /* Basic use */
  describe('add()', () => {
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
    itEach(
      (animal, cry) => `A ${animal} should cry '${cry}'`,
      [
        ['dog', 'bowow'],
        ['cat', 'meow'],
        ['cow', 'mow'],
        ['nothing', '...']
      ], (animal, cry) => {
        assert.equal(cry, letCry(animal));
      }
    );
  });

  function asBool(value) {
    return Boolean(value);
  }

  /* Omit test case name */
  describe('asBool()', () => {
    itEach([
      'string',
      100,
      true,
      {}
    ], value => {
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
    itEach('greets will be delayed', [
      'Alis', 'Bob', 'Caroline'
    ], (name, done) => {
      delayGreet(name, greet => {
        assert.equal(greet, `Hi, ${name}!`);
        done();
      });
    });
  });
});

