import assert from 'power-assert';
import sinon from 'sinon';
import forEach from '../lib/mocha-each';

/** @test {forEach} */
describe('mocha-each', () => {
  const mochaIt = it;
  let _it = null;

  beforeEach(() => {
    _it = sinon.spy();
    global.it = mochaIt;
  });

  it('uses global `it` automatically', () => {
    global.it = _it;
    forEach([0]).it('', () => {});
    assert(_it.calledOnce);
  });

  it('accepts a second argument which specifies `it` explicitly', () => {
    forEach([0], _it).it('', () => {});
    assert(_it.calledOnce);
  });

  it('binds `this` to the context of `it` (Mocha instance)', () => {
    const test = sinon.spy();
    const _this = {};
    const _it = (name, b) => body = b;
    let body;
    forEach([0], _it).it('', test);
    body.call(_this);
    assert.equal(test.thisValues[0], _this);
  });

  context('without Mocha', () => {
    it('throws an error when called', () => {
      delete global.it;
      assert.throws(() => {
        forEach([0]).it('', () => {});
      }, /it is not a function/);
    });
  });

  context('with string title', () => {
    it('defines titles using the specified one and each index', () => {
      forEach([3, 2, 1, 0], _it).it('title', () => {});
      assert.deepEqual(
        _it.args.map(a => a[0]),
        [1, 2, 3, 4].map(i => `title (case ${i})`)
      );
    });
  });

  context('with function title', () => {
    it('calls the function and defines titles using its return value', () => {
      forEach([
        4, 8, 12, 16
      ], _it)
      .it(
        p => `generated ${p / 2}`,
        () => {}
      );
      assert.deepEqual(
        _it.args.map(a => a[0]),
        [2, 4, 6, 8].map(n => `generated ${n}`)
      );
    });
  });

  context('with empty parameters', () => {
    it('defines no test cases', () => {
      forEach([], _it).it('', () => {});
      assert(! _it.calledOnce);
    });
  });

  context('with valid parameters', () => {
    it('defines the same number of test cases as the parameters', () => {
      const params = [0, 1, 2, 3, 4, 5];
      forEach(params, _it).it('', () => {});
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
      const _it = (name, body) => body();
      forEach(params, _it).it('', test);
      assert.deepEqual(test.args, params);
    });

    context('which is an array of non-array values', () => {
      it('passes each parameter as a first argument', () => {
        const params = [0, 1, 2, 3];
        const test = sinon.spy();
        const _it = (name, body) => body();
        forEach(params, _it).it('', test);
        assert.deepEqual(
          test.args,
          params.map(p => [p])
        );
      });
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
    const mochaDescribe = describe;
    let _describe;

    beforeEach(() => {
      _describe = sinon.spy();
      _describe.only = sinon.spy();
      global.describe = _describe;
    });

    afterEach(() => {
      global.describe = mochaDescribe;
    });

    it('creates a nameless test suite', () => {
      forEach([0], _it).it.only('', () => {});
      const suiteTitle = _describe.only.args[0][0];
      assert.equal(suiteTitle, '');
    });

    it('creates a test suite using its `.only()` method', () => {
      const _descOnly = _describe.only;
      const params = [0, 1, 2, 3];
      forEach(params, _it).it.only('', () => {});

      assert.deepEqual(
        [_descOnly.callCount, _it.callCount],
        [1, 0]
      );
      assert.deepEqual(
        _descOnly.args[0].map(a => typeof a),
        ['string', 'function']
      );

      const runTestSuite = _descOnly.args[0][1];
      runTestSuite();

      assert.equal(_it.callCount, params.length);
      assert.equal(_describe.callCount, 0);
    });
  });

  describe('.it.skip()', () => {
    beforeEach(() => _it.skip = sinon.spy());
    afterEach(() => delete _it.skip);

    it('defines each test case using Mocha\'s `it.skip()` method', () => {
      const params = [3, 2, 1, 0];
      const makeTitle = p => `test for ${p}`;
      forEach(params, _it).it.skip(makeTitle, () => {});
      assert.deepEqual(
        _it.skip.args.map(a => a[0]),
        params.map(makeTitle)
      );
    });
  });
});

