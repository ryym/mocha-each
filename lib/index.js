
/**
 * Return true if the testBody seems to be async.
 * @private
 */
function isAsync(parameters, testBody) {
  const nLongestParam = parameters.reduce((n, param) => {
    return Math.max(n, param.length);
  }, 0);
  return nLongestParam < testBody.length;
}

/**
 * Defines Mocha test cases for each given parameter.
 * @param {(string|function)} testName - A prefix of each test case name.
 *     When it is a function, its return value is used for each test case name.
 * @param {Array} parameters - An array of values. Each of this
 *     will be passed to testBody function.
 * @param {function} testBody - A function which contains test code.
 * @param {function} it - The 'it' function used in this function.
 *     If omitted, 'it' in global name space is used.
 */
export default function itEach(
  testName, parameters, testBody, it = global.it
) {
  if (! (2 <= arguments.length && arguments.length <= 4)) {
    throw new Error('itEach: Signature is itEach([name,] parameters, body)');
  }

  // When the testName is omitted.
  if (typeof parameters === 'function') {
    it = testBody || it;
    testBody = parameters;
    parameters = testName;
    testName = index => `handles case ${index + 1}`;
  }

  const makeTestName = (typeof testName === 'function')
    ? testName
    : index => `${testName} (case ${index + 1})`;


  const arrayedParams = parameters.map(param => {
    return Array.isArray(param) ? param : [param];
  });

  const makeActualTestBody = isAsync(arrayedParams, testBody)
    ? args => done => testBody.apply(null, args.concat(done))
    : args => () => testBody(...args);

  arrayedParams.forEach((param, index) => {
    it(
      makeTestName(...[index, ...param]),
      makeActualTestBody(param)
    );
  });
}

/***
 * Define exclusive parameterized tests.
 * The signature is same as {@link itEach}.
 * @see {@link itEach}
 */
itEach.only = function(...args) {
  global.describe.only('', () => {
    itEach(...args);
  });
};

/**
 * Define parameterized tests to be ignored.
 * The signature is same as {@link itEach}.
 * @see {@link itEach}
 */
itEach.skip = function(
  testName, parameters, testBody, it = global.it
) {
  itEach(testName, parameters, testBody, it.skip);
};
