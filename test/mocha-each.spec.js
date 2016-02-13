
/** @test {forEach} */
describe('mocha-each', () => {
  it('uses global `it` automatically');

  it('accepts a second argument which specifies `it` explicitly');

  it('binds `this` to the context of `it` (Mocha instance)');

  context('without Mocha', () => {
    it('throws an error when called');
  });

  context('with string title', () => {
    it('defines titles using the specified one and each index');
  });

  context('with function title', () => {
    it('calls the function and defines titles using its return value');
  });

  context('with empty parameters', () => {
    it('defines no test cases');
  });

  context('with valid parameters', () => {
    it('defines the same number of test cases as the parameters');

    it('gives each parameter as arguments to the test function');

    context('which is an array of non-array values', () => {
      it('passes each parameter as a first argument');
    });
  });

  context('for asynchronous test', () => {
    context('when the test function takes an additional argument', () => {
      it('gives a `done` callback used for asynchronous code');

      it('binds `this` to the context of `it` (Mocha instance)');
    });

    context('when the lengths of parameters are different', () => {
      context('if any param is many more than the arguments', () => {
        it('gives a `done` callback');
      });

      context('otherwise', () => {
        it('does not give a `done` callback');
      });
    });

    context('when the parameters are arrays of non-array values', () => {
      it('gives a `done` callback');
    });
  });

  describe('.it.only()', () => {
    it('creates a nameless test suite');

    it('creates a test suite using its `.only()` method');
  });

  describe('.it.skip()', () => {
    it('defines each test case using Mocha\'s `it.skip()` method');
  });
});

