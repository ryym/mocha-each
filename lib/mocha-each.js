
/**
 * Create a function which defines test cases for
 * each given parameter.
 * @private
 */
function makeTestCaseDefiner(parameters, it) {
  return function defineTestCases(title, test) {
    const makeTitle = (typeof title === 'function')
      ? title
      : (...args) => `${title} (case ${args.pop() + 1})`;

    const arrayedParams = parameters.map(param => {
      return Array.isArray(param) ? param : [param];
    });

    const isAsync = isAsyncTest(arrayedParams, test);
    arrayedParams.forEach((param, index) => {
      it(
        makeTitle(...[...param, index]),
        makeTestBody(param, test, isAsync)
      );
    });
  };
}

/**
 * Wrap a given test function and convert it to
 * a function passed to the `it`.
 * @private
 */
function makeTestBody(param, test, isAsync) {
  if (isAsync) {
    return function(done) {
      test.apply(this, param.concat(done));
    };
  }
  return function() {
    test.apply(this, param);
  };
}

/**
 * Return true if the testBody seems to be async.
 * @private
 */
function isAsyncTest(parameters, test) {
  const nLongestParam = parameters.reduce((n, param) => {
    return Math.max(n, param.length);
  }, 0);
  return nLongestParam < test.length;
}

/**
 * Defines Mocha test cases for each given parameter.
 * @param {Array} parameters
 * @param {function} it - The 'it' function used in this function.
 *     If omitted, 'it' in global name space is used.
 * @return {Object} The object which has a method to define test cases.
 */
export default function forEach(parameters, defaultIt = global.it) {
  const it = makeTestCaseDefiner(parameters, defaultIt);

  it.skip = makeTestCaseDefiner(
    parameters,
    defaultIt ? defaultIt.skip : undefined
  );

  it.only = function(title, test) {
    const only = makeTestCaseDefiner(parameters, defaultIt);
    global.describe.only('', () => {
      only(title, test);
    });
  };
  return { it };
}
