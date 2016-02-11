import assert from 'power-assert';
import sinon from 'sinon';
import itEach from '$lib';

describe('itEach()', () => {
  const mochaIt = it;
  let _it = null;

  beforeEach(() => {
    _it = sinon.spy();
    global.it = mochaIt;
  });

  it('uses global `it` automatically', () => {
    global.it = _it;
    itEach('', [0], () => {});
    assert(_it.calledOnce);
  });

  context('without Mocha', () => {
    it('throws an error when called', () => {
      delete global.it;
      assert.throws(() => {
        itEach('', [0], () => {});
      }, /Mocha is not found/);
    });
  });

  context('without test name', () => {
    it('defines tests using a default test name');
  });

  context('with string test name', () => {
    it('defines tests by the specified name and each parameter');
  });

  context('with function test name', () => {
    it('calls the function and defines tests using its return value');
  });

  context('with empty parameters', () => {
    it('defines no test cases');
  });

  context('with valid parameters', () => {
    it('defines the same number of test cases as the parameters');

    it('gives each parameter as arguments to the test function');
  });

  context('with invalid arguments', () => {
    it('TODO');
  });

  context('with asynchronous test', () => {
    it('TODO');
  });

  describe('.using()', () => {
    it('TODO');
  });

  describe('.only()', () => {
    it('TODO');
  });

  describe('.skip()', () => {
    it('TODO');
  });
});
