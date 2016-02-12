
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
    testName = `handles`;
  }

  if (typeof it !== 'function') {
    throw new Error('itEach: Mocha is not found');
  }

  const makeTestName = (typeof testName === 'function')
    ? testName
    : param => `${testName} ${JSON.stringify(param)}`;

  parameters.forEach(param => {
    const args = Array.isArray(param) ? param : [param];
    it(makeTestName(...args), () => testBody(...args));
  });
}

/***
 * Define exclusive parameterized tests.
 * The signature is same as {@link itEach}.
 * @see {@link itEach}
 */
itEach.only = function(...args) {
  if (typeof global.describe !== 'function') {
    throw new Error('itEach: Mocha is not found');
  }
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
  // TODO: Check if 'it' exists.
  itEach(testName, parameters, testBody, it.skip);
};
