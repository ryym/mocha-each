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

  it('accepts fourth argument which specify `it` explicitly', () => {
    itEach('', [0], () => {}, _it);
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
    it('defines no test cases', () => {
      itEach('', [], () => {}, _it);
      assert(! _it.calledOnce);
    });
  });

  context('with valid parameters', () => {
    it('defines the same number of test cases as the parameters', () => {
      const params = [0, 1, 2, 3, 4, 5];
      itEach('', params, () => {}, _it);
      assert.equal(_it.callCount, params.length);
    });

    it('gives each parameter as arguments to the test function', () => {
      const params = [
        [0, 1, 2],
        [[2, 4, 6], 40.5],
        [[1, 2, 3], [4, 5, 6]],
        ['foo', 'bar'],
        ['name', { a: 1, b: 1, c: 1 }, {n: []}],
        [null, undefined, undefined, false]
      ];
      const test = sinon.spy();
      itEach('', params, test, (name, body) => body());
      assert.deepEqual(test.args, params);
    });

    context('with an array of non-array values', () => {
      it('passes each parameter as a first argument', () => {
        const params = [0, 1, 2, 3];
        const test = sinon.spy();
        itEach('', params, test, (name, body) => body());

        const expectedArgs = params.map(p => [p]);
        assert.deepEqual(test.args, expectedArgs);
      });
    });
  });

  context('with invalid arguments', () => {
    it('TODO');
  });

  context('with asynchronous test', () => {
    it('TODO');
  });

  describe('.only()', () => {
    it('TODO');
  });

  describe('.skip()', () => {
    it('TODO');
  });
});
