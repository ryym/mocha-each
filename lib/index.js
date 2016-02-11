
/**
 * Defines Mocha test cases for each given parameter.
 * @param {(string|function)} testName - A prefix of each test case name.
 *     When it is a function, its return value is used for each test case name.
 * @param {Array} parameters - An array of values. Each of this
 *     will be passed to testBody function.
 * @param {function} testBody - A function which contains test code.
 * @param {function} it - The 'it' function used in this function.
 *     This is mainly used in unit tests.
 */
export default function itEach(
  testName, parameters, testBody, it = global.it
) {
  if (typeof it !== 'function') {
    throw new Error('itEach: Mocha is not found');
  }

  // When the testName is omitted.
  if (typeof parameters === 'function') {
    it = testBody || it;
    testBody = parameters;
    parameters = testName;
    testName = `handles`;
  }

  const makeTestName = (typeof testName === 'function')
    ? testName
    : param => `${testName} ${JSON.stringify(param)}`;

  parameters.forEach(param => {
    const args = Array.isArray(param) ? param : [param];
    it(makeTestName(...args), () => testBody(...args));
  });
}

